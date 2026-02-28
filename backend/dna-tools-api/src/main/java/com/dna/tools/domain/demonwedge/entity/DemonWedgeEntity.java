package com.dna.tools.domain.demonwedge.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "demon_wedges", uniqueConstraints = {
        @UniqueConstraint(name = "uk_demon_wedge_slug", columnNames = "slug")
})
public class DemonWedgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String image;

    @Column(nullable = false)
    private Integer rarity;

    @Column(nullable = false)
    private Integer resistance;

    @Column(length = 10)
    private String tendency;

    @Column(name = "equip_type", nullable = false, length = 30)
    private String equipType;

    @Column(length = 10)
    private String element;

    @Column(name = "is_kukulkan", nullable = false)
    private Boolean isKukulkan;

    @Column(name = "item_code", insertable = false, updatable = false, length = 4)
    private String itemCode;

    @Column(name = "effect_description", columnDefinition = "TEXT")
    private String effectDescription;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "demonWedge", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<DemonWedgeStatEntity> stats = new ArrayList<>();

    @OneToMany(mappedBy = "demonWedge", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<DemonWedgeConditionalEffectEntity> conditionalEffects = new ArrayList<>();

    // ===== 생성 팩토리 =====
    public static DemonWedgeEntity create(
            String slug, String name, String image,
            Integer rarity, Integer resistance, String tendency,
            String equipType, String element, Boolean isKukulkan,
            String effectDescription) {
        DemonWedgeEntity e = new DemonWedgeEntity();
        e.slug = slug;
        e.name = name;
        e.image = image;
        e.rarity = rarity;
        e.resistance = resistance;
        e.tendency = tendency;
        e.equipType = equipType;
        e.element = element;
        e.isKukulkan = isKukulkan;
        e.effectDescription = effectDescription;
        return e;
    }

    // ===== 수정 =====
    public void update(
            String slug, String name, String image,
            Integer rarity, Integer resistance, String tendency,
            String equipType, String element, Boolean isKukulkan,
            String effectDescription) {
        this.slug = slug;
        this.name = name;
        this.image = image;
        this.rarity = rarity;
        this.resistance = resistance;
        this.tendency = tendency;
        this.equipType = equipType;
        this.element = element;
        this.isKukulkan = isKukulkan;
        this.effectDescription = effectDescription;
    }

    // ===== 스탯 관리 =====
    public void clearStats() {
        this.stats.clear();
    }

    public void addStat(String statType, java.math.BigDecimal value) {
        this.stats.add(new DemonWedgeStatEntity(this, statType, value));
    }

    // ===== 조건부 효과 관리 =====
    public void clearConditionalEffects() {
        this.conditionalEffects.clear();
    }

    public void addConditionalEffect(String statType, java.math.BigDecimal value) {
        this.conditionalEffects.add(new DemonWedgeConditionalEffectEntity(this, statType, value));
    }
}
