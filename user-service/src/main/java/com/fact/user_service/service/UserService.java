package com.fact.user_service.service;

import com.fact.user_service.dto.UserRequest;
import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.mapper.UserMapper;
import com.fact.user_service.model.AppUser;
import com.fact.user_service.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        createDefaultUsers(); // Initialize with some users
    }

    private void createDefaultUsers() {
        saveUser ("ahm282", "Ahmed", "Mahgoub", "ahmed@wallet.be");
        saveUser ("hollegijs", "Holle", "Gijs", "holle.gijs@wallet.be");
    }

    private void saveUser (String username, String firstName, String lastName, String email) {
        AppUser user = AppUser.builder()
                .username(username)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode("hashedPasswordTopSecret"))
                .createdAt(System.currentTimeMillis())
                .build();

        userRepository.save(user);
    }

    public List<UserResponse> getAllUsers() {
        List<AppUser> appUsers = userRepository.findAll();

        // Sort by creation date
        appUsers.sort(Comparator.comparingLong(AppUser::getCreatedAt));

        return appUsers.stream().map(userMapper::toUserResponse).toList();
    }

    public Optional<UserResponse> getUserById(UUID id) {
        Optional<AppUser> user = userRepository.findById(id);
        return user.map(userMapper::toUserResponse);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
        Optional<AppUser> existingUserByUsername = userRepository.findByUsername(userRequest.getUsername());
        Optional<AppUser> existingUserByEmail = userRepository.findByEmail(userRequest.getEmail());

        if (existingUserByUsername.isPresent() || existingUserByEmail.isPresent()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(userRequest.getPassword());

        // Create a new user instance
        AppUser newUser = AppUser.builder()
                .username(userRequest.getUsername())
                .password(hashedPassword)
                .email(userRequest.getEmail())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .createdAt(System.currentTimeMillis())
                .build();

        // Save the new user to the database
        AppUser savedUser = userRepository.save(newUser);

        // Build UserResponse object (to adjust sent attributes)
        UserResponse userResponse = userMapper.toUserResponse(savedUser);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    public ResponseEntity<HttpStatus> deleteUserById(UUID id) {
        Optional<AppUser> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public boolean authenticateUser(String username, String password) {
        // Fetch the user by username
        Optional<AppUser> user = userRepository.findByUsername(username);

        // If the user exists, check if the password matches, else return false
        return user.filter(appUser -> passwordEncoder.matches(password, appUser.getPassword())).isPresent();
    }
}
