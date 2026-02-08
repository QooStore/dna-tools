package com.dna.tools.domain.demonwedge.controller;

import com.dna.tools.domain.demonwedge.dto.DemonWedgeDetailResponse;
import com.dna.tools.domain.demonwedge.dto.DemonWedgeListResponse;
import com.dna.tools.domain.demonwedge.service.DemonWedgeService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demon-wedges")
public class DemonWedgeController {

    private final DemonWedgeService demonWedgeService;

    public DemonWedgeController(DemonWedgeService demonWedgeService) {
        this.demonWedgeService = demonWedgeService;
    }

    @GetMapping
    public List<DemonWedgeListResponse> getAllDemonWedges() {
        return demonWedgeService.getAllDemonWedges();
    }

    @GetMapping("/{slug}")
    public DemonWedgeDetailResponse getDemonWedgeBySlug(@PathVariable String slug) {
        return demonWedgeService.getDemonWedgeBySlug(slug);
    }
}
