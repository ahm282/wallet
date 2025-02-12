package com.fact.user_service.model;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AppUser {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  private String username;
  private String firstName;
  private String lastName;
  private String email;
  private String password;
  private Long createdAt;
  private String imageUrl;

  @PrePersist
  private void generateId() {
    if (this.id == null) {
      this.id = UUID.randomUUID();
    }
  }
}
