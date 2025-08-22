package com.examly.springapp.service;

import com.examly.springapp.model.Response;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    public void sendTicketStatusChange(Ticket ticket) {
        if (ticket.getUserId() == null) {
            return;
        }

        Optional<User> userOpt = userRepository.findById(ticket.getUserId());
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();

        String latestResponseText = "";
        if (ticket.getResponses() != null && !ticket.getResponses().isEmpty()) {
            Response latestResponse = ticket.getResponses()
                    .get(ticket.getResponses().size() - 1); // last response
            latestResponseText = "\n\nLatest Response:\n" + latestResponse.getMessage();
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Ticket Status Update");
        message.setText("Hello " + user.getName() + ",\n\n"
                + "Your ticket #" + ticket.getId() + " (" + ticket.getSubject() + ") "
                + "status has been updated to: " + ticket.getStatus() + "."
                + latestResponseText
                + "\n\nThank you,\nSupport Team");

        mailSender.send(message);
    }
}
