package com.examly.springapp.controller;

import com.examly.springapp.dto.*;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.Response;
import com.examly.springapp.service.TicketService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "https://customer-system-frontend.vercel.app")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequestDto dto) {
        Ticket ticket = Ticket.builder()
                .subject(dto.getSubject())
                .description(dto.getDescription())
                .priority(Ticket.TicketPriority.valueOf(dto.getPriority()))
                .createdBy(dto.getCreatedBy())
                .build();
        Ticket saved = ticketService.createTicket(ticket);
        return new ResponseEntity<>(toDto(saved), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public List<TicketDetailsDto> getAllTickets() {
        return ticketService.getAllTickets().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Ticket not found"));
        }
        return ResponseEntity.ok(toDto(ticketOpt.get()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusUpdateDto dto) {

        Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Ticket not found"));
        }
        Ticket.TicketStatus status;
        try {
            status = Ticket.TicketStatus.valueOf(dto.getStatus());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorMessage("Invalid status: " + dto.getStatus()));
        }
        Ticket updated = ticketService.updateTicketStatus(id, status);
        return ResponseEntity.ok(toDto(updated));
    }

    @PostMapping("/{ticketId}/responses")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<?> addResponse(@PathVariable Long ticketId, @Valid @RequestBody ResponseRequestDto dto) {
        try {
            Response response = Response.builder()
                .message(dto.getMessage())
                .respondedBy(dto.getRespondedBy())
                .build();
            response.setRespondedAt(LocalDateTime.now());
            Response saved = ticketService.addResponseToTicket(ticketId, response);
            return new ResponseEntity<>(toResponseDto(saved), HttpStatus.CREATED);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Ticket not found"));
        } catch (IllegalArgumentException ex) {
            String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
            if (msg.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Ticket not found"));
            }
            return ResponseEntity.badRequest().body(new ErrorMessage(ex.getMessage()));
        }
    }

    @GetMapping("/{ticketId}/responses")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<?> getResponses(@PathVariable Long ticketId) {
        try {
            List<Response> responses = ticketService.getResponsesForTicket(ticketId);
            List<ResponseDetailsDto> responseDtos = responses.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responseDtos);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Ticket not found"));
        }
    }

    private TicketDetailsDto toDto(Ticket ticket) {
        List<ResponseDetailsDto> responses = ticket.getResponses() == null ? List.of() :
                ticket.getResponses().stream()
                        .map(this::toResponseDto)
                        .collect(Collectors.toList());
        return new TicketDetailsDto(
            ticket.getId(),
            ticket.getSubject(),
            ticket.getDescription(),
            ticket.getStatus().toString(),
            ticket.getPriority().toString(),
            ticket.getCreatedBy(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            responses
        );
    }
    private ResponseDetailsDto toResponseDto(Response response) {
        return new ResponseDetailsDto(
            response.getId(),
            response.getMessage(),
            response.getRespondedBy(),
            response.getRespondedAt()
        );
    }

    private static class ErrorMessage {
        public String message;
        public ErrorMessage(String m) { message = m; }
    }

    public record TicketDetailsDto(Long id, String subject, String description, String status, String priority, String createdBy, java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt, List<ResponseDetailsDto> responses) {}

    public record ResponseDetailsDto(Long id, String message, String respondedBy, java.time.LocalDateTime respondedAt) {}
}
