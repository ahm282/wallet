package com.fact.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    /**
     * User creation mostly
     */
//    private String username;
    private String firstName;
    private String lastName;
    private String email;
//    private String password;
    private String imageUrl;
}
