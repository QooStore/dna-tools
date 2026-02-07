package com.dna.tools.domain.weapon.repository;

import com.dna.tools.domain.weapon.entity.WeaponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeaponRepository extends JpaRepository<WeaponEntity, Long> {

    List<WeaponEntity> findAllByOrderByIdAsc();
}
