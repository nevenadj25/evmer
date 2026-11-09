package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.service.AssignmentService;


@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    //Prikaz zaduzenja
    @GetMapping("/active")
    public Page<ActiveAssignmentResponse> getActiveAssignments(
            @ModelAttribute AssignmentFilter request,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ){
        return assignmentService.getActiveAssignments(request, pageable);
    }

    @GetMapping("/history")
    public Page<HistoryAssignmentResponse> getAssignmentHistory(
            @ModelAttribute AssignmentFilter request,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return assignmentService.getAssignmentHistory(request, pageable);
    }

    //Vracanje uzete opreme
    @PatchMapping("/unassign/{id}")
    public ResponseEntity<?> unassignEquipment(
            @PathVariable Long id,
            @RequestBody UnassignRequest request
    ){
        return assignmentService.unassignEquipment(id,request);
    }

}
