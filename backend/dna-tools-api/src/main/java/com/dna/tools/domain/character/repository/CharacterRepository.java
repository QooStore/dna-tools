package com.dna.tools.domain.character.repository;

import com.dna.tools.domain.character.entity.CharacterEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository extends JpaRepository<CharacterEntity, Long> {

        /** EntityGraph 연관 테이블 영속 상태 한번에 조회 */
        @EntityGraph(attributePaths = {
                        "stats",
                        "consonanceWeapon",
                        "features",
                        "skills",
                        "introns",
                        "passiveUpgrades"
        })
        Optional<CharacterEntity> findBySlug(String slug);

        /** 캐릭터 목록 조회 */
        @Query("""
                        select distinct c
                        from CharacterEntity c
                        left join fetch c.features
                        order by c.id
                                        """)
        List<CharacterEntity> findAllCharacterList();
}
