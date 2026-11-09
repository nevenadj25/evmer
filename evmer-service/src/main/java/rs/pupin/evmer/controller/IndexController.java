package rs.pupin.evmer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.service.IndexService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authenticated/index")
public class IndexController {

    private final IndexService indexService;

    @GetMapping("/summary")
    public EquipmentSummaryIndex getSummary() {
        return indexService.getSummary();
    }

    @GetMapping("/assignments")
    public Page<UserAssignmentIndex> getAssignments(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return indexService.getAssignments(pageable);
    }

    @GetMapping("/reservations")
    public Page<ActiveReservationIndex> getReservations(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return indexService.getReservations(pageable);
    }

    @GetMapping("/calibrations")
    public Page<CalibrationIndex> getCalibrations(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return indexService.getCalibrations(pageable);
    }

    @GetMapping("/activities")
    public Page<UserActivityIndex> getActivities(
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return indexService.getActivities(pageable);
    }
}
