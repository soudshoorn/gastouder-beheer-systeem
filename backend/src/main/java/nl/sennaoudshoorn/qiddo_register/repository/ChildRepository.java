package nl.sennaoudshoorn.qiddo_register.repository;

import nl.sennaoudshoorn.qiddo_register.model.Child;
import nl.sennaoudshoorn.qiddo_register.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {
    List<Child> findByParent(Parent parent);
    List<Child> findByParentId(Long parentId);
    List<Child> findByActiveTrue();
    List<Child> findByActiveFalse();
}