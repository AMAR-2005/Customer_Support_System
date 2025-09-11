package com.examly.springapp.controller;

import com.examly.springapp.Security.jwt.JwtUtil;
import com.examly.springapp.dto.TicketRequestDto;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://customer-system-frontend.vercel.app","http://localhost:3000", "https://v0.app", "https://*.v0.app", "https://*.vercel.app"})
public class CustomerController {

    private final TicketService ticketService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/tickets")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequestDto dto, 
                                        @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Ticket ticket = Ticket.builder()
                    .subject(dto.getSubject())
                    .description(dto.getDescription())
                    .priority(Ticket.TicketPriority.valueOf(dto.getPriority()))
                    .createdBy(user.getName())
                    .userId(user.getId())
                    .build();
            
            Ticket saved = ticketService.createTicket(ticket);
            return new ResponseEntity<>(toDto(saved), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating ticket: " + e.getMessage());
        }
    }

    @GetMapping("/tickets")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyTickets(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Ticket> userTickets = ticketService.getTicketsByUserId(user.getId());
            List<TicketDetailsDto> ticketDtos = userTickets.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ticketDtos);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error fetching tickets: " + e.getMessage());
        }
    }

    @GetMapping("/tickets/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyTicket(@PathVariable Long id, 
                                       @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Ticket ticket = ticketService.getTicketById(id)
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));
            
            // Ensure customer can only access their own tickets
            if (!ticket.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(toDto(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching ticket: " + e.getMessage());
        }
    }

    private TicketDetailsDto toDto(Ticket ticket) {
        return new TicketDetailsDto(
            ticket.getId(),
            ticket.getSubject(),
            ticket.getDescription(),
            ticket.getStatus().toString(),
            ticket.getPriority().toString(),
            ticket.getCreatedBy(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            ticket.getResponses() != null ? 
                ticket.getResponses().stream()
                    .map(r -> new ResponseDetailsDto(r.getId(), r.getMessage(), r.getRespondedBy(), r.getRespondedAt()))
                    .collect(Collectors.toList()) : List.of()
        );
    }

    public record TicketDetailsDto(Long id, String subject, String description, String status, 
                                 String priority, String createdBy, java.time.LocalDateTime createdAt, 
                                 java.time.LocalDateTime updatedAt, List<ResponseDetailsDto> responses) {}
    
    public record ResponseDetailsDto(Long id, String message, String respondedBy, java.time.LocalDateTime respondedAt) {}
}
