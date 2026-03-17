package com.cybercrime.service;

import com.cybercrime.dto.EvidenceFileDto;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface EvidenceService {
    List<EvidenceFileDto> upload(Long complaintId, MultipartFile[] files);
    Resource download(Long evidenceId);
}
