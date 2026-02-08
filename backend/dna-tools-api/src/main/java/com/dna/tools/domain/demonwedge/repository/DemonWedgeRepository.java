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
            order by d.id asc
            """)
    List<DemonWedgeEntity> findAllWithStats();

    Optional<DemonWedgeEntity> findBySlug(String slug);
}
