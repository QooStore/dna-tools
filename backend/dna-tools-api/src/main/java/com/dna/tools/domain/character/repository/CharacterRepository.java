package com.dna.tools.domain.character.repository;

import com.dna.tools.domain.character.entity.CharacterEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository extends JpaRepository<CharacterEntity, Long> {

        /** 1:1 관계만 EntityGraph로 조회 (1:N은 @BatchSize로 별도 로딩) */
        @EntityGraph(attributePaths = {
                        "stats",
                        "consonanceWeapon"
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
