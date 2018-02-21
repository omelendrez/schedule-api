DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_blocked`(_from int, _to int, _budget_id int, _employee_id int)
BEGIN

	SELECT e.`first_name`, a.`from`, a.`to` FROM availability AS a
    INNER JOIN employee as e ON e.id = a.employee_id 
    WHERE a.employee_id = _employee_id
    AND a.week_day = (SELECT weekday(date) FROM budget AS b WHERE b.id = _budget_id)
    AND(
		a.`from` BETWEEN _from AND _to
        OR
		a.`to` BETWEEN _from AND _to
        OR
		_from BETWEEN a.`from` AND a.`to`
        OR
		_to BETWEEN a.`from` AND a.`to`
        );
END$$
DELIMITER ;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_overwrite`(_id int, _from int, _to int, _budget_id int, _employee_id int)
BEGIN

	SELECT e.`first_name`, s.`from`, s.`to` 
    FROM schedule AS s
    INNER JOIN employee AS e ON e.id = s.employee_id 
    WHERE ((_from between s.from and s.to-1) OR (_to between s.from+1 and s.to)) 
    AND s.budget_id=_budget_id
    AND s.employee_id=_employee_id
    AND (_employee_id = 0 OR s.id<>_id) 
    LIMIT 1;

END$$
DELIMITER ;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_presence`(_budget_id INT, _employee_id INT)
BEGIN

	SET @report_date = (SELECT date FROM budget WHERE id=`_budget_id`);
	SELECT SUM(COALESCE((SELECT DISTINCT 1 FROM schedule AS s WHERE s.budget_id = b.id AND s.employee_id = `_employee_id` ), 0)) AS presence 
    FROM budget AS b 
    WHERE b.date BETWEEN DATE_ADD(@report_date, INTERVAL -6 DAY) AND DATE_ADD(@report_date, INTERVAL -1 DAY);

END$$
DELIMITER ;
