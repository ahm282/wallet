package com.fact.user_service.mapper;

import com.fact.user_service.dto.UserResponse;
import com.fact.user_service.model.AppUser;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UserResponse toUserResponse(AppUser appUser) {
    return UserResponse.builder()
        .id(appUser.getId())
        .username(appUser.getUsername())
        .email(appUser.getEmail())
        .firstName(appUser.getFirstName())
        .lastName(appUser.getLastName())
        .imageUrl(appUser.getImageUrl())
        .lastLogin(appUser.getLastLogin())
        .build();
  }
}
