package com.examly.springapp.controller;

import com.examly.springapp.dto.ResponseRequestDto;
import com.examly.springapp.dto.TicketRequestDto;
import com.examly.springapp.dto.TicketStatusUpdateDto;
import com.examly.springapp.model.Ticket;
import com.examly.springapp.repository.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private ObjectMapper objectMapper;

    @BeforeEach
    public void cleanDb() {
        ticketRepository.deleteAll();
    }

    @Test
    public void ticketCreationTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("Cannot login to account");
        req.setDescription("I'm trying to login but keep getting an error message");
        req.setPriority("HIGH");
        req.setCreatedBy("John Doe");

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.subject").value(req.getSubject()))
                .andExpect(jsonPath("$.description").value(req.getDescription()))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.createdBy").value("John Doe"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists())
                .andExpect(jsonPath("$.responses", hasSize(0)));
    }

    @Test
    public void ticketValidationTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("Hi"); // Too short
        req.setDescription("Valid long description");
        req.setPriority("HIGH");
        req.setCreatedBy("User");

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("subject")));
    }

    @Test
    public void ticketStatusUpdateTest() throws Exception {
        TicketRequestDto create = new TicketRequestDto();
        create.setSubject("Issue");
        create.setDescription("Problem occurred");
        create.setPriority("LOW");
        create.setCreatedBy("Tester");

        ResultActions createResult = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(create)))
            .andExpect(status().isCreated());

        String createdTicketJson = createResult.andReturn().getResponse().getContentAsString();
        Integer id = (Integer) objectMapper.readValue(createdTicketJson, Map.class).get("id");

        TicketStatusUpdateDto upd = new TicketStatusUpdateDto();
        upd.setStatus("IN_PROGRESS");

        mockMvc.perform(patch("/api/tickets/{id}/status", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(upd)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        upd.setStatus("INVALID");

        mockMvc.perform(patch("/api/tickets/{id}/status", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(upd)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid status")));

        mockMvc.perform(patch("/api/tickets/{id}/status", 99999)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(upd)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    public void responseCreationTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("A ticket");
        req.setDescription("A long enough description");
        req.setPriority("LOW");
        req.setCreatedBy("Customer");

        String ticketJson = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer id = (Integer) objectMapper.readValue(ticketJson, Map.class).get("id");

        ResponseRequestDto resp = new ResponseRequestDto();
        resp.setMessage("Please check your internet");
        resp.setRespondedBy("Support");

        mockMvc.perform(post("/api/tickets/{id}/responses", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resp)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value(resp.getMessage()))
                .andExpect(jsonPath("$.respondedBy").value(resp.getRespondedBy()))
                .andExpect(jsonPath("$.respondedAt").exists());

        String ticketWithRespJson = mockMvc.perform(get("/api/tickets/{id}", id))
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> t = objectMapper.readValue(ticketWithRespJson, Map.class);
        assert ((String) t.get("status")).equals("IN_PROGRESS");

        resp.setMessage("Second Message");

        mockMvc.perform(post("/api/tickets/{id}/responses", 99999)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resp)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    public void ticketWithResponsesTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("A very important ticket");
        req.setDescription("Some description that is sufficiently long");
        req.setPriority("MEDIUM");
        req.setCreatedBy("Jack");

        String ticketJson = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andReturn().getResponse().getContentAsString();

        Integer id = (Integer) objectMapper.readValue(ticketJson, Map.class).get("id");

        ResponseRequestDto resp = new ResponseRequestDto();
        resp.setMessage("Initial investigation started");
        resp.setRespondedBy("Support Agent");

        mockMvc.perform(post("/api/tickets/{id}/responses", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resp)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/tickets/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.responses", hasSize(1)))
                .andExpect(jsonPath("$.responses[0].message").value("Initial investigation started"));
    }

    // --- Additional 10 Test Cases ---

    @Test
    public void getAllTicketsTest() throws Exception {
        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

  

    @Test
    public void ticketUpdateInvalidFieldTest() throws Exception {
        mockMvc.perform(patch("/api/tickets/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"invalidField\":\"value\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void responseValidationFailureTest() throws Exception {
        ResponseRequestDto dto = new ResponseRequestDto();
        dto.setMessage(""); // Invalid
        dto.setRespondedBy("Agent");

        mockMvc.perform(post("/api/tickets/1/responses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void fetchTicketByIdNotFoundTest() throws Exception {
        mockMvc.perform(get("/api/tickets/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void ticketPriorityValidationTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("Valid Subject");
        req.setDescription("Long enough description");
        req.setPriority("INVALID");
        req.setCreatedBy("Someone");

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void fetchTicketByIdSuccessTest() throws Exception {
        TicketRequestDto req = new TicketRequestDto();
        req.setSubject("Subject");
        req.setDescription("Valid Description");
        req.setPriority("LOW");
        req.setCreatedBy("User");

        String ticket = mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Integer id = (Integer) objectMapper.readValue(ticket, Map.class).get("id");

        mockMvc.perform(get("/api/tickets/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    public void createMultipleTicketsAndFetchAll() throws Exception {
        for (int i = 0; i < 3; i++) {
            TicketRequestDto req = new TicketRequestDto();
            req.setSubject("Ticket " + i);
            req.setDescription("Description for ticket " + i);
            req.setPriority("MEDIUM");
            req.setCreatedBy("Bot");
            mockMvc.perform(post("/api/tickets")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated());
        }

        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    public void emptyRequestBodyTest() throws Exception {
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    
}
