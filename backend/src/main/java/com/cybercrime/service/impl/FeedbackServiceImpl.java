package com.cybercrime.service.impl;

import com.cybercrime.dto.FeedbackRequest;
import com.cybercrime.entity.Feedback;
import com.cybercrime.entity.User;
import com.cybercrime.exception.BadRequestException;
import com.cybercrime.exception.ResourceNotFoundException;
import com.cybercrime.repository.ComplaintRepository;
import com.cybercrime.repository.FeedbackRepository;
import com.cybercrime.repository.UserRepository;
import com.cybercrime.service.FeedbackService;
import com.cybercrime.util.SecurityUtil;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final ComplaintRepository complaintRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Override
    public void submitFeedback(Long complaintId, FeedbackRequest request) {
        if (feedbackRepository.findByComplaintId(complaintId).isPresent()) {
            throw new BadRequestException("Feedback already submitted");
        }
        User citizen = userRepository.findByEmail(SecurityUtil.currentUsername()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        feedbackRepository.save(Feedback.builder()
                .complaint(complaint)
                .citizen(citizen)
                .rating(request.getRating())
                .satisfactionScore(request.getSatisfactionScore())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build());
    }
}
