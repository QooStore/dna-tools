package com.dna.tools.init;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;

// import com.dna.tools.domain.admin.entity.AdminUser;
// import com.dna.tools.domain.admin.repository.AdminUserRepository;

// import lombok.RequiredArgsConstructor;

// /** 관리자 계정 1회 생성용 */

// @Component
// @RequiredArgsConstructor
// public class AdminUserInitializer implements CommandLineRunner {

// private final AdminUserRepository adminUserRepository;
// private final PasswordEncoder passwordEncoder;

// @Override
// public void run(String... args) {
// String userId = "";
// String password = passwordEncoder.encode("");
// String userName = "";

// AdminUser admin = new AdminUser(userId, userName, password, "ADMIN");

// adminUserRepository.save(admin);
// }
// }
