package com.dna.tools.domain.admin.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dna.tools.domain.admin.dto.CharacterSaveRequest;
import com.dna.tools.domain.admin.service.CharacterAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee/characters")
public class CharacterAdminController {

    private final CharacterAdminService characterAdminService;

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteCharacter(@PathVariable Long id) {
        characterAdminService.deleteCharacter(id);
    }

    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public void create(@RequestBody CharacterSaveRequest request) {
        characterAdminService.create(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public void update(
            @PathVariable Long id,
            @RequestBody CharacterSaveRequest request) {
        characterAdminService.update(id, request);
    }
}
