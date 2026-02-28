package com.dna.tools.domain.character.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.dna.tools.domain.admin.dto.CharacterSaveRequest;

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

    @Column(name = "melee_proficiency", length = 20)
    private String meleeProficiency;

    @Column(name = "ranged_proficiency", length = 20)
    private String rangedProficiency;

    @Column(name = "item_code", insertable = false, updatable = false, length = 5)
    private String itemCode;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    /** 연관 관계 */
    @OneToOne(mappedBy = "character", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
            CascadeType.REMOVE }, orphanRemoval = true)
    private CharacterStatsEntity stats;

    @OneToOne(mappedBy = "character", fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
            CascadeType.REMOVE }, orphanRemoval = true)
    private ConsonanceWeaponEntity consonanceWeapon;

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<CharacterFeatureEntity> features = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<SkillEntity> skills = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stage ASC")
    @BatchSize(size = 30)
    private List<IntronEntity> introns = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<PassiveUpgradeEntity> passiveUpgrades = new ArrayList<>();

    @OneToMany(mappedBy = "character", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @BatchSize(size = 30)
    private List<CharacterConditionalEffectEntity> conditionalEffects = new ArrayList<>();

    // ===== 생성 팩토리 (등록) =====
    public static CharacterEntity create(
            String slug,
            String name,
            String element,
            String image,
            String elementImage,
            String listImage,
            String meleeProficiency,
            String rangedProficiency) {
        CharacterEntity c = new CharacterEntity();
        c.slug = slug;
        c.name = name;
        c.element = element;
        c.image = image;
        c.elementImage = elementImage;
        c.listImage = listImage;
        c.meleeProficiency = meleeProficiency;
        c.rangedProficiency = rangedProficiency;
        return c;
    }

    // ===== 기본 정보 수정 (수정) =====
    public void updateBasic(
            String slug,
            String name,
            String element,
            String image,
            String elementImage,
            String listImage,
            String meleeProficiency,
            String rangedProficiency) {
        this.slug = slug;
        this.name = name;
        this.element = element;
        this.image = image;
        this.elementImage = elementImage;
        this.listImage = listImage;
        this.meleeProficiency = meleeProficiency;
        this.rangedProficiency = rangedProficiency;
    }

    // ===== 1:1 관계 세터 =====
    public void setStats(CharacterStatsEntity stats) {
        this.stats = stats;
    }

    public void setConsonanceWeapon(ConsonanceWeaponEntity weapon) {
        this.consonanceWeapon = weapon;
    }

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

    // ===== Passive Upgrade =====
    public void addPassiveUpgrade(
            String upgradeKey,
            String upgradeType,
            String targetStat,
            java.math.BigDecimal value,
            String name,
            String description) {
        this.passiveUpgrades.add(
                new PassiveUpgradeEntity(
                        this,
                        upgradeKey,
                        upgradeType,
                        targetStat,
                        value,
                        name,
                        description));
    }

    public void clearConditionalEffects() {
        this.conditionalEffects.clear();
    }

    public void addConditionalEffect(String sourceType, Integer intronStage, String statType,
            java.math.BigDecimal value) {
        this.conditionalEffects.add(
                new CharacterConditionalEffectEntity(this, sourceType, intronStage, statType, value));
    }

    public void syncPassiveUpgrades(List<CharacterSaveRequest.PassiveUpgrade> reqs) {
        Map<String, PassiveUpgradeEntity> current = this.passiveUpgrades.stream()
                .collect(Collectors.toMap(
                        PassiveUpgradeEntity::getUpgradeKey,
                        Function.identity()));

        // update or insert
        for (var r : reqs) {
            if (current.containsKey(r.getUpgradeKey())) {
                current.get(r.getUpgradeKey()).update(
                        r.getUpgradeKey(),
                        r.getUpgradeType(),
                        r.getTargetStat(),
                        r.getValue(),
                        r.getName(),
                        r.getDescription());
            } else {
                this.passiveUpgrades.add(new PassiveUpgradeEntity(
                        this,
                        r.getUpgradeKey(),
                        r.getUpgradeType(),
                        r.getTargetStat(),
                        r.getValue(),
                        r.getName(),
                        r.getDescription()));
            }
        }

        // delete removed
        this.passiveUpgrades.removeIf(
                e -> reqs.stream()
                        .noneMatch(r -> r.getUpgradeKey().equals(e.getUpgradeKey())));
    }

}
