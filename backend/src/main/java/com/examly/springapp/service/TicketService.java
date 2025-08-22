package com.examly.springapp.service;

import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.Response;
import com.examly.springapp.repository.TicketRepository;
import com.examly.springapp.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final ResponseRepository responseRepository;

    @Autowired
    private  NotificationService notificationService;
    public TicketService(TicketRepository ticketRepository, ResponseRepository responseRepository) {
        this.ticketRepository = ticketRepository;
        this.responseRepository = responseRepository;
    }
    public long countByStatus(String status) {
        Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status); // converts "PENDING" -> TicketStatus.PENDING
        return ticketRepository.countByStatus(ticketStatus);
    }
    public Ticket createTicket(Ticket ticket) {
        if (ticket.getSubject() == null || ticket.getSubject().length() < 5 || ticket.getSubject().length() > 100) {
            throw new IllegalArgumentException("subject: size must be between 5 and 100");
        }
        if (ticket.getDescription() == null || ticket.getDescription().length() < 10 || ticket.getDescription().length() > 1000) {
            throw new IllegalArgumentException("description: size must be between 10 and 1000");
        }
        if (ticket.getCreatedBy() == null || ticket.getCreatedBy().length() < 2 || ticket.getCreatedBy().length() > 50) {
            throw new IllegalArgumentException("createdBy: size must be between 2 and 50");
        }
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId);
    }

    @Transactional
    public Ticket updateTicketStatus(Long ticketId, Ticket.TicketStatus status) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new EntityNotFoundException("Ticket not found");
        }
        Ticket ticket = ticketOpt.get();
        Ticket.TicketStatus oldStatus = ticket.getStatus();
        if (oldStatus != status) {
            ticket.setStatus(status);
            ticket.setUpdatedAt(LocalDateTime.now());
            Ticket savedTicket = ticketRepository.save(ticket);

            notificationService.sendTicketStatusChange(savedTicket);

            return savedTicket;
        }
       return ticket;
    }

    @Transactional
    public Response addResponseToTicket(Long ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(EntityNotFoundException::new);
        response.setTicket(ticket);
        response.setRespondedAt(LocalDateTime.now());
        if (response.getMessage() == null || response.getMessage().isEmpty() || response.getMessage().length() > 500) {
            throw new IllegalArgumentException("message: size must be at most 500");
        }
        if (response.getRespondedBy() == null || response.getRespondedBy().length() < 2 || response.getRespondedBy().length() > 50) {
            throw new IllegalArgumentException("respondedBy: size must be between 2 and 50");
        }
        Response savedResponse = responseRepository.save(response);
        if (ticket.getStatus() == Ticket.TicketStatus.OPEN) {
            ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);
        }
        return savedResponse;
    }

    public List<Response> getResponsesForTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(EntityNotFoundException::new);
        return responseRepository.findByTicketOrderByRespondedAtDesc(ticket);
    }

    public List<Ticket> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getTotalTicketCount() {
        return ticketRepository.count();
    }
}
