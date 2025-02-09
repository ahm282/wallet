//package com.fact.user_service;
//
//import com.fact.user_service.dto.UserRequest;
//import com.fact.user_service.dto.UserResponse;
//import com.fact.user_service.mapper.UserMapper;
//import com.fact.user_service.model.AppUser;
//import com.fact.user_service.repository.UserRepository;
//import com.fact.user_service.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class UserServiceTests {
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private UserMapper userMapper;
//
//    @Mock
//    private BCryptPasswordEncoder passwordEncoder;
//
//    @InjectMocks
//    private UserService userService;
//
//    private UserRequest validUserRequest;
//    private AppUser savedAppUser;
//    private UserResponse userResponse;
//
//    @BeforeEach
//    void setUp() {
//        // Setup mock data
//        validUserRequest = new UserRequest();
//        validUserRequest.setUsername("testuser");
//        validUserRequest.setPassword("password123");
//        validUserRequest.setEmail("test@example.com");
//        validUserRequest.setFirstName("Test");
//        validUserRequest.setLastName("User");
//
//        savedAppUser = AppUser.builder()
//                .id(UUID.randomUUID())
//                .username(validUserRequest.getUsername())
//                .email(validUserRequest.getEmail())
//                .build();
//
//        userResponse = new UserResponse();
//        userResponse.setId(savedAppUser.getId());
//        userResponse.setUsername(savedAppUser.getUsername());
//    }
//
//    @Test
//    void testGetAllUsers() {
//        // Arrange
//        List<AppUser> mockUsers = Arrays.asList(
//                AppUser.builder().username("user1").createdAt(1000L).build(),
//                AppUser.builder().username("user2").createdAt(2000L).build()
//        );
//
//        List<UserResponse> mockUserResponses = Arrays.asList(
//                new UserResponse(), new UserResponse()
//        );
//
//        when(userRepository.findAll()).thenReturn(mockUsers);
//        when(userMapper.toUserResponse(any(AppUser.class)))
//                .thenReturn(mockUserResponses.get(0), mockUserResponses.get(1));
//
//        // Act
//        List<UserResponse> result = userService.getAllUsers();
//
//        // Assert
//        assertEquals(2, result.size());
//        verify(userRepository).findAll();
//    }
//
////    @Test
////    void testCreateUser_Success() {
////        // Arrange
////        when(userRepository.findByUsername(validUserRequest.getUsername())).thenReturn(Optional.empty());
////        when(userRepository.findByEmail(validUserRequest.getEmail())).thenReturn(Optional.empty());
////        when(passwordEncoder.encode(validUserRequest.getPassword())).thenReturn("encodedPassword");
////        when(userRepository.save(any(AppUser.class))).thenReturn(savedAppUser);
////        when(userMapper.toUserResponse(savedAppUser)).thenReturn(userResponse);
////
////        // Act
////        ResponseEntity<UserResponse> response = userService.createUser(validUserRequest);
////
////        // Assert
////        assertEquals(HttpStatus.CREATED, response.getStatusCode());
////        assertNotNull(response.getBody());
////        assertEquals(savedAppUser.getId(), response.getBody().getId());
////
////        verify(userRepository).save(any(AppUser.class));
////        verify(passwordEncoder).encode(validUserRequest.getPassword());
////    }
////
////    @Test
////    void testCreateUser_Conflict() {
////        // Arrange
////        when(userRepository.findByUsername(validUserRequest.getUsername())).thenReturn(Optional.of(new AppUser()));
////
////        // Act
////        ResponseEntity<UserResponse> response = userService.createUser(validUserRequest);
////
////        // Assert
////        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
////        verify(userRepository, never()).save(any(AppUser.class));
////    }
//
//    @Test
//    void testGetUserById_Found() {
//        // Arrange
//        AppUser mockUser = AppUser.builder()
//                .id(UUID.randomUUID())
//                .username("ppeeters")
//                .firstName("Piet")
//                .lastName("Peeters")
//                .build();
//
//        // Create a UserResponse that matches the mockUser
//        UserResponse mockUserResponse = new UserResponse();
//        mockUserResponse.setId(mockUser.getId());
//        mockUserResponse.setUsername(mockUser.getUsername());
//
//        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
//        when(userMapper.toUserResponse(mockUser)).thenReturn(mockUserResponse);
//
//        // Act
//        Optional<UserResponse> result = userService.getUserById(mockUser.getId());
//
//        // Assert
//        assertTrue(result.isPresent());
//        assertEquals(mockUser.getId(), result.get().getId());
//        verify(userRepository).findById(mockUser.getId());
//    }
//
//    @Test
//    void testGetUserById_NotFound() {
//        // Arrange
//        UUID testId = UUID.randomUUID();
//        when(userRepository.findById(testId)).thenReturn(Optional.empty());
//
//        // Act
//        Optional<UserResponse> result = userService.getUserById(testId);
//
//        // Assert
//        assertTrue(result.isEmpty());
//    }
//
//    @Test
//    void testDeleteUserById_Success() {
//        // Arrange
//        UUID testId = UUID.randomUUID();
//        AppUser mockUser = AppUser.builder().id(testId).build();
//
//        when(userRepository.findById(testId)).thenReturn(Optional.of(mockUser));
//
//        // Act
//        ResponseEntity<HttpStatus> response = userService.deleteUserById(testId);
//
//        // Assert
//        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
//        verify(userRepository).deleteById(testId);
//    }
//
//    @Test
//    void testDeleteUserById_NotFound() {
//        // Arrange
//        UUID testId = UUID.randomUUID();
//        when(userRepository.findById(testId)).thenReturn(Optional.empty());
//
//        // Act
//        ResponseEntity<HttpStatus> response = userService.deleteUserById(testId);
//
//        // Assert
//        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//        verify(userRepository, never()).deleteById(any());
//    }
//
//    @Test
//    void testAuthenticateUser_Success() {
//        // Arrange
//        String username = "testuser";
//        String rawPassword = "password123";
//        String encodedPassword = "encodedPassword";
//
//        AppUser mockUser = AppUser.builder()
//                .username(username)
//                .password(encodedPassword)
//                .build();
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
//        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
//
//        // Act
//        boolean result = userService.authenticateUser(username, rawPassword);
//
//        // Assert
//        assertTrue(result);
//    }
//
//    @Test
//    void testAuthenticateUser_Failure() {
//        // Arrange
//        String username = "testuser";
//        String rawPassword = "wrongpassword";
//        String encodedPassword = "encodedPassword";
//
//        AppUser mockUser = AppUser.builder()
//                .username(username)
//                .password(encodedPassword)
//                .build();
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
//        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);
//
//        // Act
//        boolean result = userService.authenticateUser(username, rawPassword);
//
//        // Assert
//        assertFalse(result);
//    }
//
//    @Test
//    void testAuthenticateUser_UserNotFound() {
//        // Arrange
//        String username = "nonexistentuser";
//        String rawPassword = "password123";
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
//
//        // Act
//        boolean result = userService.authenticateUser(username, rawPassword);
//
//        // Assert
//        assertFalse(result);
//    }
//}