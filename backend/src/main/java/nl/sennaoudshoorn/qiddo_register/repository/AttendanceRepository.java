package nl.sennaoudshoorn.qiddo_register.repository;

import nl.sennaoudshoorn.qiddo_register.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByChildId(Long childId);
} 