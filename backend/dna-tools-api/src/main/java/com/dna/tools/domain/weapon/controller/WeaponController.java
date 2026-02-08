package com.dna.tools.domain.weapon.controller;

import com.dna.tools.domain.weapon.dto.WeaponDetailResponse;
import com.dna.tools.domain.weapon.dto.WeaponListResponse;
import com.dna.tools.domain.weapon.service.WeaponService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weapons")
public class WeaponController {

    private final WeaponService weaponService;

    public WeaponController(WeaponService weaponService) {
        this.weaponService = weaponService;
    }

    @GetMapping
    public List<WeaponListResponse> getAllWeapons() {
        return weaponService.getAllWeapons();
    }

    @GetMapping("/{slug}")
    public WeaponDetailResponse getWeaponBySlug(@PathVariable String slug) {
        return weaponService.getWeaponBySlug(slug);
    }
}
