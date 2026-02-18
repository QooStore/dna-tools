package com.dna.tools.domain.admin.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dna.tools.domain.admin.dto.DemonWedgeSaveRequest;
import com.dna.tools.domain.admin.service.DemonWedgeAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lee/demon-wedges")
public class DemonWedgeAdminController {

    private final DemonWedgeAdminService demonWedgeAdminService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public void create(@RequestBody DemonWedgeSaveRequest request) {
        demonWedgeAdminService.create(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{slug}")
    public void update(
            @PathVariable String slug,
            @RequestBody DemonWedgeSaveRequest request) {
        demonWedgeAdminService.updateBySlug(slug, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        demonWedgeAdminService.delete(id);
    }
}
