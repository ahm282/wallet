package com.fact.user_service.repository;

import com.fact.user_service.model.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, UUID> {
  Optional<AppUser> findByEmail(String email);

  Optional<AppUser> findByUsername(String username);
}
