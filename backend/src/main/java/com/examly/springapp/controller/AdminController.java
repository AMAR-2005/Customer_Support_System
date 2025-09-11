package com.examly.springapp.controller;

import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.TicketService;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
//@CrossOrigin(origins = {"https://customer-system-frontend.vercel.app","http://localhost:3000", "https://v0.app", "https://*.v0.app", "https://*.vercel.app"})
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketService ticketService;

    @PostMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAgent(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User agent = new User();
        agent.setName(request.getName());
        agent.setEmail(request.getEmail());
        agent.setPassword(passwordEncoder.encode(request.getPassword()));
        agent.setRole(User.Role.AGENT);
        agent.setCreatedAt(LocalDateTime.now());
        userRepository.save(agent);
        return ResponseEntity.ok("Agent created successfully");
    }

//    @GetMapping("/users")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> getAllUsers() {
//        List<User> users = userRepository.findAll();
//        List<UserDto> userDtos = users.stream()
//                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().toString(), u.getCreatedAt()))
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(userDtos);
//    }
        @GetMapping("/users")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> getAllUsers(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size
        ) {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userPage = userRepository.findAll(pageable);

            List<UserDto> userDtos = userPage.getContent().stream()
                    .map(u -> new UserDto(
                            u.getId(),
                            u.getName(),
                            u.getEmail(),
                            u.getRole().toString(),
                            u.getCreatedAt()
                    ))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("users", userDtos);
            response.put("currentPage", userPage.getNumber());
            response.put("totalItems", userPage.getTotalElements());
            response.put("totalPages", userPage.getTotalPages());
            response.put("pageSize", userPage.getSize());

            return ResponseEntity.ok(response);
        }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemStats() {
        try {
            long totalUsers = userRepository.count();
            long totalTickets = ticketService.getTotalTicketCount();
            long pendingTickets = ticketService.countByStatus("IN_PROGRESS");
            long openTickets = ticketService.countByStatus("OPEN");
            long resolvedTickets = ticketService.countByStatus("RESOLVED");
            long closedTickets = ticketService.countByStatus("CLOSED");
            long totalAdmins = userRepository.countByRole(User.Role.ADMIN);
            long totalAgents = userRepository.countByRole(User.Role.AGENT);
            long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);

            return ResponseEntity.ok(
                    new SystemStatsDto(totalUsers, totalTickets, pendingTickets,openTickets, resolvedTickets,closedTickets, totalAdmins,totalAgents,totalCustomers)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching system stats: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userRepository.findById(id).get();
        if (user.getRole() == User.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Cannot delete admin user");
        }
        
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    public record UserDto(Long id, String name, String email, String role, LocalDateTime createdAt) {}

    public record SystemStatsDto(
            @JsonProperty("totalUsers") long totalUsers,
            @JsonProperty("totalTickets") long totalTickets,
            @JsonProperty("pendingTickets") long pendingTickets,
            @JsonProperty("openTickets") long openTickets,
            @JsonProperty("resolvedTickets") long resolvedTickets,
            @JsonProperty("closedTickets") long closedTickets,
            long totalAdmins,
            long totalAgents,
            long totalCustomers
    ) {}
}
