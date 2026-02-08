package com.dna.tools.domain.demonwedge.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "demon_wedge_stats")
public class DemonWedgeStatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demon_wedge_id", nullable = false)
    private DemonWedgeEntity demonWedge;

    @Column(name = "stat_type", nullable = false, length = 30)
    private String statType;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    public DemonWedgeStatEntity(DemonWedgeEntity demonWedge, String statType, BigDecimal value) {
        this.demonWedge = demonWedge;
        this.statType = statType;
        this.value = value;
    }
}
