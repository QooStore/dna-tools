package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "characters", uniqueConstraints = {
        @UniqueConstraint(name = "slug", columnNames = "slug")
})
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String slug;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private String element;

    @Column(nullable = false, length = 255)
    private String image;

    @Column(name = "element_image", nullable = false, length = 255)
    private String elementImage;

    @Column(name = "list_image", nullable = false, length = 255)
    private String listImage;

    @Column(name = "melee_proficiency", nullable = false, length = 20)
    private String meleeProficiency;

    @Column(name = "ranged_proficiency", nullable = false, length = 20)
    private String rangedProficiency;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 연관 관계 */
    @OneToOne(mappedBy = "character", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
            CascadeType.REMOVE }, orphanRemoval = true)
    private CharacterStatsEntity stats;

    @OneToOne(mappedBy = "character", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.REMOVE })
    private ConsonanceWeaponEntity consonanceWeapon;

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterFeatureEntity> features = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkillEntity> skills = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stage ASC")
    private List<IntronEntity> introns = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PassiveUpgradeEntity> passiveUpgrades = new ArrayList<>();

    // @PrePersist
    // protected void onCreate() {
    // this.createdAt = LocalDateTime.now();
    // }

    /** feature 테이블 데이터 컬럼 제어(addFeature, clearFeatures) */
    public void addFeature(String feature) {
        this.features.add(new CharacterFeatureEntity(this, feature));
    }

    public void clearFeatures() {
        this.features.clear();
    }

    /** Skills 테이블 데이터 컬럼 제어(addSkill, clearSkills) */
    public void addSkill(String name, String type, String description) {
        this.skills.add(new SkillEntity(this, name, type, description));
    }

    public void clearSkills() {
        this.skills.clear();
    }

    /** Intron 테이블 데이터 컬럼 제어(addIntron, clearIntrons) */
    public void addIntron(int stage, String description) {
        this.introns.add(new IntronEntity(this, stage, description));
    }

    public void clearIntrons() {
        this.introns.clear();
    }

}
