package com.fact.user_service;

import com.fact.user_service.controller.UserController;
import com.fact.user_service.dto.UserRequest;
import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

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
        UserRequest newMockUser = new UserRequest("arnep", "Arne", "Pelkmans", "apelkmans@telecom.be", "topsecret");

        // Create a UserResponse that the service would return after user creation
        UserResponse createdUserResponse = new UserResponse(userId, "arnep", "Arne", "Pelkmans", "apelkmans@telecom.be", now);

        // Mock the service to simulate user creation and retrieval
        when(userService.createUser(newMockUser)).thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(createdUserResponse));

        // Mock the deleteUserById method to return ResponseEntity status for deletion
        when(userService.deleteUserById(createdUserResponse.getId())).thenReturn(ResponseEntity.ok(HttpStatus.OK)); // Mock the return of deleteUserById to return ResponseEntity<HttpStatus>

        // Act: Simulate POST request to create the user
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"username\": \"arnep\", \"firstName\": \"Arne\", \"lastName\": \"Pelkmans\", \"email\": \"apelkmans@telecom.be\", \"password\": \"topsecret\" }"))
                .andExpect(status().isCreated());  // Expecting 201 Created status after creation

        // Act: Simulate DELETE request to delete the user by ID
        mockMvc.perform(delete("/api/users/{id}", createdUserResponse.getId()))
                .andExpect(status().isOk());  // Expecting 200 OK status after successful deletion

        verify(userService, times(1)).deleteUserById(createdUserResponse.getId());
    }

    @Test
    void shouldReturnNotFoundWhenUserToDeleteDoesNotExist() throws Exception {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userService.getUserById(userId)).thenReturn(Optional.empty());
        when(userService.deleteUserById(userId)).thenReturn(ResponseEntity.notFound().build());

        // Act & Assert
        mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).deleteUserById(userId);
    }
}