package com.dna.tools.domain.demonwedge.repository;

import com.dna.tools.domain.demonwedge.entity.DemonWedgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DemonWedgeRepository extends JpaRepository<DemonWedgeEntity, Long> {

    @Query("""
            select distinct d
            from DemonWedgeEntity d
            left join fetch d.stats
            order by d.rarity asc,
            case d.equipType
                when 'character' then 1
                when 'meleeWeapon' then 2
                when 'rangedWeapon' then 3
                when 'meleeConsonanceWeapon' then 4
                when 'rangedConsonanceWeapon' then 5
                else 6
            end asc,
            d.element asc,
            d.name asc
            """)
    List<DemonWedgeEntity> findAllWithStats();

    Optional<DemonWedgeEntity> findBySlug(String slug);
}
