package com.project.inventory.bootstrap;

import com.project.inventory.entity.Role;
import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        createRoles();
        createDefaultAdmin();
        createDefaultAgent();
    }

    private void createRoles() {
        // Create ADMIN role if it doesn't exist
        if (roleRepository.findByName(RoleEnum.ADMIN).isEmpty()) {
            Role adminRole = new Role(RoleEnum.ADMIN, "System Administrator");
            roleRepository.save(adminRole);
        }

        // Create MANAGER role if it doesn't exist
        if (roleRepository.findByName(RoleEnum.MANAGER).isEmpty()) {
            Role managerRole = new Role(RoleEnum.MANAGER, "Inventory Manager");
            roleRepository.save(managerRole);
        }

        // Create AGENT role if it doesn't exist
        if (roleRepository.findByName(RoleEnum.AGENT).isEmpty()) {
            Role agentRole = new Role(RoleEnum.AGENT, "Inventory Agent");
            roleRepository.save(agentRole);
        }
    }

    private void createDefaultAdmin() {
        // Create default manager user if it doesn't exist
        if (!userRepository.existsByEmail("manager@inventory.com")) {
            Role managerRole = roleRepository.findByName(RoleEnum.MANAGER).orElseThrow();

            User manager = new User();
            manager.setFullName("System Manager");
            manager.setEmail("manager@inventory.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setPhone("1234567890");
            manager.setRole(managerRole);

            userRepository.save(manager);
        }

        // Create default admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@inventory.com")) {
            Role adminRole = roleRepository.findByName(RoleEnum.ADMIN).orElseThrow();

            User admin = new User();
            admin.setFullName("System Administrator");
            admin.setEmail("admin@inventory.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("1234567890");
            admin.setRole(adminRole);

            userRepository.save(admin);
        }
    }

    private void createDefaultAgent() {
        if (!userRepository.existsByEmail("agent@inventory.com")) {
            Role agentRole = roleRepository.findByName(RoleEnum.AGENT).orElseThrow();

            User agent = new User();
            agent.setFullName("Inventory Agent");
            agent.setEmail("agent@inventory.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setPhone("1234567890");
            agent.setRole(agentRole);

            userRepository.save(agent);
        }
    }
}
