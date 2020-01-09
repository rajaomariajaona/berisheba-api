(SELECT "DemiJournee_date", "DemiJournee_TypeDemiJournee"
	FROM public."Constituer" 
	LEFT JOIN "DemiJournee" ON "DemiJournee_date" = "date" 
		AND "DemiJournee_TypeDemiJournee" = "TypeDemiJournee" 
	LEFT JOIN "Reservation" ON "Reservation_idReservation" = "idReservation"
	WHERE "idReservation" = 1
	ORDER BY 
	"DemiJournee_date",
	"DemiJournee_TypeDemiJournee" LIMIT 1)
	
	UNION ALL
	
	(SELECT "DemiJournee_date", "DemiJournee_TypeDemiJournee"
	FROM public."Constituer" 
	LEFT JOIN "DemiJournee" ON "DemiJournee_date" = "date" 
		AND "DemiJournee_TypeDemiJournee" = "TypeDemiJournee" 
	LEFT JOIN "Reservation" ON "Reservation_idReservation" = "idReservation"
	WHERE "idReservation" = 1
	ORDER BY 
	"DemiJournee_date" DESC,
	"DemiJournee_TypeDemiJournee" DESC LIMIT 1);
	
	