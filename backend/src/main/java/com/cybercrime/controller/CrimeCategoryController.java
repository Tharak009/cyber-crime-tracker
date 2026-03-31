package com.cybercrime.controller;

import com.cybercrime.dto.ApiResponse;
import com.cybercrime.dto.CrimeCategoryDto;
import com.cybercrime.repository.CrimeCategoryRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CrimeCategoryController {
    private final CrimeCategoryRepository crimeCategoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CrimeCategoryDto>>> getCategories() {
        List<CrimeCategoryDto> categories = crimeCategoryRepository.findAll().stream()
                .map(category -> CrimeCategoryDto.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .build())
                .toList();

        return ResponseEntity.ok(ApiResponse.<List<CrimeCategoryDto>>builder()
                .success(true)
                .message("Categories fetched")
                .data(categories)
                .timestamp(LocalDateTime.now())
                .build());
    }
}
