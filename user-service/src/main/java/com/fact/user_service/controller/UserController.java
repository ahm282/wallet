package com.fact.user_service.controller;

import com.fact.user_service.dto.UserRequest;
import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.service.UserService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/user", "/api/user/"})
public class UserController {
  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<UserResponse> getAllUsers() {
    return this.userService.getAllUsers();
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> getUserById(@PathVariable("id") String id) {
    UUID userId = UUID.fromString(id);
    Optional<UserResponse> user = this.userService.getUserById(userId);
    return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {
    return userService.createUser(userRequest);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") String id) {
    UUID userId = UUID.fromString(id);
    return userService.deleteUserById(userId);
  }
}
