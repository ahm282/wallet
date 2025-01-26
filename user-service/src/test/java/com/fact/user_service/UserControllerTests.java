package com.fact.user_service;

import com.fact.user_service.controller.UserController;
import com.fact.user_service.dto.UserRequest;
import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class)
class UserControllerTests {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void shouldGetAllUsers() throws Exception {
        // Arrange
        Long now = System.currentTimeMillis();
        UserResponse user1 = new UserResponse(UUID.randomUUID(), "hansb", "Hans", "Bartholomeus", "hasb@example.com", now);
        UserResponse user2 = new UserResponse(UUID.randomUUID(), "marcdb", "Marc", "De Boer", "m.deboer@example.com", now);

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        // Act & Assert: Perform GET request and verify the response
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("hansb"))
                .andExpect(jsonPath("$[1].username").value("marcdb"));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void shouldGetUserById() throws Exception {
        // Arrange: Mock the service to return a specific user
        UUID userId = UUID.randomUUID();
        Long now = System.currentTimeMillis();
        UserResponse user = new UserResponse(userId, "woutp", "Wout", "Peeters", "woutp@gmail.com", now);

        when(userService.getUserById(userId)).thenReturn(Optional.of(user));

        // Act & Assert: Perform GET request for a specific user ID and verify the response
        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("woutp"));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void shouldReturnNotFoundWhenUserNotExists() throws Exception {
        // Arrange: Mock the service to return an empty Optional (user does not exist)
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        // Act & Assert: Perform GET request and verify that the response status is 404 (Not Found)
        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void shouldCreateUser() throws Exception {
        // Arrange: Prepare the user request and mock the service to return a user response
        Long now = System.currentTimeMillis();
        UserRequest userRequest = new UserRequest("robbedb", "Robbe", "De Busser", "robbed@tm.com", "puddingmeneer");
        UserResponse userResponse = new UserResponse(UUID.randomUUID(), "robbedb", "Robbe", "De Busser", "robbed@tm.com", now);

        when(userService.createUser(any(UserRequest.class))).thenReturn(ResponseEntity.ok(userResponse));

        // Act & Assert: Perform POST request to create a user and verify the response
        mockMvc.perform(post("/api/users")
                        .contentType("application/json")
                        .content("{\"username\": \"robbedb\", \"email\": \"robbed@tm.com\", \"password\": \"puddingmeneer\", \"firstName\": \"Robbe\", \"lastName\": \"De Busser\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("robbedb"))
                .andExpect(jsonPath("$.email").value("robbed@tm.com"));

        verify(userService, times(1)).createUser(any(UserRequest.class));
    }

    @Test
    void shouldDeleteUser() throws Exception {
        // Arrange: Mock the service to return an existing user
        UUID userId = UUID.randomUUID();
        Long now = System.currentTimeMillis();
        UserResponse user = new UserResponse(userId, "arnep", "Arne", "Pelkmans", "apelkmans@telecom.be", now);

        when(userService.getUserById(userId)).thenReturn(Optional.of(user));
        doNothing().when(userService).deleteUserById(userId);

        // Act & Assert: Perform DELETE request and verify the response
        mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isOk());

        verify(userService, times(1)).deleteUserById(userId);
    }

    @Test
    void shouldReturnNotFoundWhenUserToDeleteDoesNotExist() throws Exception {
        // Arrange: Mock the service to return an empty Optional (user does not exist)
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        // Act & Assert: Perform DELETE request and verify that the response status is 404 (Not Found)
        mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getUserById(userId);
    }
}
