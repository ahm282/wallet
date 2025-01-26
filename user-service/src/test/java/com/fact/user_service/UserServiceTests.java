package com.fact.user_service;

import com.fact.user_service.dto.UserRequest;
import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.mapper.UserMapper;
import com.fact.user_service.model.AppUser;
import com.fact.user_service.repository.UserRepository;
import com.fact.user_service.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

class UserServiceTests {
    private AutoCloseable mocks;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);

        when(userMapper.toUserResponse(any(AppUser.class))).thenAnswer(invocation ->
        {
            AppUser user = invocation.getArgument(0);
            return new UserResponse(user.getId(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getCreatedAt());
        });
    }

    @AfterEach
    void tearDown() throws Exception {
        if (mocks != null) {
            mocks.close();
        }
    }

    @Test
    void shouldGetAllUsers() {
        // Arrange
        Long now = System.currentTimeMillis();
        AppUser user1 = new AppUser(UUID.randomUUID(), "jpeeters", "Jan", "Peeters", "jp@gmail.com", "password1", now);
        AppUser user2 = new AppUser(UUID.randomUUID(), "emmav", "Emma", "Vermeulen", "emmav@gmail.com", "password2", now);

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        // Act
        List<UserResponse> users = userService.getAllUsers();

        // Assert
        assertEquals(2, users.size());
        assertEquals("jpeeters", users.get(0).getUsername());
        assertEquals("emmav@gmail.com", users.get(1).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void shouldGetUserById() {
        // Arrange
        Long now = System.currentTimeMillis();
        UUID userId = UUID.randomUUID();
        AppUser user = new AppUser(userId, "maartenmaes", "Maarten", "Maes", "maarten.maes@gmail.com", "fortnite", now);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        Optional<UserResponse> userResponse = userService.getUserById(userId);

        // Assert
        assertTrue(userResponse.isPresent());

        assertEquals("maartenmaes", userResponse.get().getUsername());
        assertEquals("maarten.maes@gmail.com", userResponse.get().getEmail());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void shouldReturnEmptyWhenUserNotFoundById() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        Optional<UserResponse> userResponse = userService.getUserById(userId);

        // Assert
        assertTrue(userResponse.isEmpty());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void shouldCreateUser() {
        Long now = System.currentTimeMillis();

        // Arrange
        UserRequest userRequest = new UserRequest("evdoesburg", "Els", "Van Doesburg", "els@example.be", "password3");
        AppUser savedUser = new AppUser(UUID.randomUUID(),"evdoesburg", "Els", "Van Doesburg", "els@example.be", "password3", now);


        when(userRepository.findByUsername("evdoesburg")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("els@example.be")).thenReturn(Optional.empty());
        when(userRepository.save(any(AppUser.class))).thenReturn(savedUser);

        // Act
        ResponseEntity<UserResponse> response = userService.createUser(userRequest); // Create the user

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Assert status is OK
        assertNotNull(response.getBody()); // Body is user confirmation
        assertEquals("evdoesburg", response.getBody().getUsername());
        assertEquals("els@example.be", response.getBody().getEmail());

        // Capture the saved user
        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class); // ArgumentCaptor captures argument passed to the 'save' method
        verify(userRepository, times(1)).save(userCaptor.capture()); // Verify that the 'save' method was called exactly once

        AppUser capturedUser = userCaptor.getValue(); // Get captured AppUser instance
        assertEquals("evdoesburg", capturedUser.getUsername());
        assertEquals("els@example.be", capturedUser.getEmail());
    }

    @Test
    void shouldReturnConflictWhenUserAlreadyExists() {
        // Arrange
        Long now = System.currentTimeMillis();
        UserRequest userRequest = new UserRequest("tomjanssens99", "Tom", "Janssens", "tom@test.com", "password");
        AppUser existingUser = new AppUser(UUID.randomUUID(), "tomjanssens99", "Tom", "Janssens", "tom@test.com", "password", now);

        when(userRepository.findByUsername("tomjanssens99")).thenReturn(Optional.of(existingUser));
        when(userRepository.findByEmail("tom@test.com")).thenReturn(Optional.empty());

        // Act
        ResponseEntity<UserResponse> response = userService.createUser(userRequest);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void shouldDeleteUserById() {
        // Arrange
        UUID userId = UUID.randomUUID();

        // Act
        userService.deleteUserById(userId);

        // Assert
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    public void testAuthenticateUser_ValidCredentials() {
        String username = "testuser";
        String password = "password123";

        String hashedPassword = "$2a$12$wILp.ZZaUTl66TR8gdDGs.NsbCmwNkG6dAA8if9vjb1x2e7K4r2CC";  // Mocked valid BCrypt hash for "password123"

        // Mock password encoding
        when(passwordEncoder.encode(password)).thenReturn(hashedPassword);  // Return the mocked valid hash

        AppUser user = new AppUser(
                UUID.randomUUID(),
                username,
                "Test",
                "User",
                "test@example.com",
                hashedPassword,  // Use the mocked valid hash
                System.currentTimeMillis()
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, hashedPassword)).thenReturn(true);  // Password matches

        // Act
        boolean authenticated = userService.authenticateUser(username, password);

        // Assert
        assertTrue(authenticated);
    }

    @Test
    public void testAuthenticateUser_InvalidCredentials() {
        String username = "testuser";
        String password = "wrongpassword";

        String hashedPassword = "$2a$12$TYjULn5jY2ovJ66bI3dvVO1O0Z1t1e10jf5H2hp.okJG8wYsOc3hC"; // Hashed "I like Java"

        // Mock password encoding
        when(passwordEncoder.encode(password)).thenReturn(hashedPassword);  // Mock correct encoding

        AppUser user = new AppUser(
                UUID.randomUUID(),
                username,
                "Test",
                "User",
                "test@example.com",
                hashedPassword,
                System.currentTimeMillis()
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, hashedPassword)).thenReturn(false);  // Mismatch for wrong password

        // Act
        boolean authenticated = userService.authenticateUser(username, password);

        // Assert
        assertFalse(authenticated);  // Assert authentication fails for incorrect password
    }

    @Test
    void testAuthenticateUser_UserDoesNotExist() {
        // Arrange
        String username = "testuser";
        String password = "password123";

        // Mock the repository to return Optional.empty() (i.e., user does not exist)
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        boolean authenticated = userService.authenticateUser(username, password);

        // Assert
        assertFalse(authenticated);  // User does not exist, so authentication should fail
    }
}