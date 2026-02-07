package com.dna.tools.domain.image.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorage {

    /** 파일 저장 후 filename(key) 반환 */
    String upload(MultipartFile file);

    /** filename으로 파일 삭제 */
    void delete(String filename);

    /** filename → full URL 조립 */
    String getUrl(String filename);

    /** full URL → filename 추출 */
    String extractFilename(String url);

    /** 파일 존재 여부 */
    boolean exists(String filename);
}
