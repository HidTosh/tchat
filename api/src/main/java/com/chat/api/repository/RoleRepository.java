package com.chat.api.repository;

import com.chat.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Role findByUserId(Integer user_id);
}
