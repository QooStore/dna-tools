package com.dna.tools.domain.admin.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dna.tools.domain.admin.dto.WeaponSaveRequest;
import com.dna.tools.domain.admin.service.WeaponAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee/weapons")
public class WeaponAdminController {

    private final WeaponAdminService weaponAdminService;

    @PostMapping
    public void create(@RequestBody WeaponSaveRequest request) {
        weaponAdminService.create(request);
    }

    @PutMapping("/{slug}")
    public void update(
            @PathVariable String slug,
            @RequestBody WeaponSaveRequest request) {
        weaponAdminService.updateBySlug(slug, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        weaponAdminService.deleteWeapon(id);
    }
}
