package com.fact.user_service.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
  private UUID id;
  private String username;
  private String firstName;
  private String lastName;
  private String email;
  private String imageUrl;
  private Long lastLogin;
}
