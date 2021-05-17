// playground requires you to assign document definition to a variable called dd

var dd = {
    defaultStyle: {
        fontSize:8,    
    },
	content: [
		{
            
		    table: {
		        
                headerRows: 1,
                widths: [ '40%', '*' ],
                body: [
                    [ 
                        { text:'MIETVERTRAG ÜBER EINEN PERSONENKRAFTWAGEN:', alignment:'center',colSpan: 2, fillColor:'#ce2127', color:"white",bold: true, fontSize:15,border:[false,false,false,false] }, 
                        "" 
                    ],
                    [ 
                        {rowSpan:2,text:'Mieter 1:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]}, 
                        {text:'Antragsteller:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                    [ 
                        '', 
                        {text:'Führerschein Nr.:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                    [ 
                        {rowSpan:2,text:'Adresse:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]}, 
                        {text:'Austellungsdatum:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                    [ 
                        '', 
                        {text:'Fahrerlaubnisklassen:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                    [ 
                        {rowSpan:2,text:'Mieter 2:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]}, 
                        {text:'Lichtbild- und Gültigkeitsprüfung durchgeführt: Ja',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                    [ 
                        '', 
                        {text:'Vertragsnummer:',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]} 
                    ],
                ]
            }
		},
		" ",
		"Nachstehend Mieter \"Mieter\" genannt",
		"und",
		"Premium Sport-Cars GmbH",
		"Ludwig-Erhard-Str. 8, 28197 Bremen",
		"- nachstehend \"Vermieter\" genannt -",
		"vereinbaren folgendes:",
		" ",
		{
            
		    table: {
		        
                headerRows: 1,
                widths: [ '*','*','*', '*' ],
                body: [
                    [ 
                        { 
                            text:'Fahrzeug',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'Fahrzeug-Id-Nr.',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'Kennzeichen',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'Bereifung',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                    ],
                    [ 
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                    ],
                ]
            }
		},
		" ",
		"für die Zeit vom 11.11.2020 19:00 Uhr bei einem KM-Stand  zu Gebrauch.",
		" ",
		"Das Fahrzeug wird mit einem vollständig gefüllten Kraftstofftank bzw. Einer vollständig geladenen Fahrzeugbatterie übergeben und der Mieter hat das Fahrzeug am Ende der Mietzeit mit einem vollständig gefüllten Kraftstofftank bzw. einer vollständig geladenen Fahrzeugbatterie zurückgeben. Wird das Fahrzeug nicht vollständig betankt zurückgegeben, beträgt die Aufwandsentschädigung pro  lieter 3,00 EUR inklusive der gesetzlichen Umsatzsteuer.",
		"der Mieter hat während der Mietdauer pro 8 Stdn. / 24Stdn. / Monat XXX Freikilometer. Darüber hinausgehende Kilometer werden mit XX EUR/km inklusive der gesetzlichen Umsatzsteuer berechnet.",
		"Die Kaution für das Fahrzeug beträgt 2.000,00 EUR",
		"Für am Fahrzeug entstandene Schäden, die nicht vorsätzlich oder grob fahrlässig verursacht wurden, beträgt die Selbstbeteiligung des Mieters pro Schadenfall 1.000,00 EUR",
		"Kosten für Sonderleistungen (z.B. Zubehör oder Reduzierung der Selbstbeteiligung) werden zusätzlich zum Basismietpreis in Rechnung gestellt.",
        " ",		
		{
            
		    table: {
		        
                headerRows: 1,
                widths: [ '*','*','*', '*', '*' ],
                body: [
                    [ 
                        { 
                            text:'Zeitraum',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'Netto Betrag',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'USt-Satz',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'USt-Betrag',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                        { 
                            text:'Gesamtbetrag',
                            alignment:'center',
                            fillColor:'#ce2127', 
                            color:"white",
                            bold: true, fontSize:13,border:[false,false,false,false] 
                        },
                    ],
                    [ 
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                        {text:' ',borderColor:["#ce2127","#ce2127","#ce2127","#ce2127"]},
                    ],
                ]
            }
		},
		" ",
		"Nach Ablauf des o.g. Mietzeitraums werden pro Monat 2.295,00 EUR inklusive der gesetzlichen Umsatzsteuer berechnet.",
		"Zusätzliche Anmerkung zum Mietvertrag:",
		" ",
		" ",
		{text:"Weitere Nebenleistungen:",bold:true},
		" ",
		{
			columns: [
				{
					text: 'Zweiter Fahrer'
				},
				{
					text: '50% Selbstbeteiligung reduzierung'
				},
				{
					text: 'Dieselfahrzeug'
				},
				{
					text: 'Wintertaugliche Bereifung'
				}
			]
		},
		" ", 
		{
			columns: [
			    [
    				{
    				    image:"sampleImage.jpg",
    	            	width: 200
    				},
    				{
    				    width: 200,height:6,
    				    svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#ce2127" stroke-width="6" />'
    				},
    				{
    				    text:"Unterschrift Vermieter"
    				}
				],
				[
    				{
    				    
    				    image:"sampleImage.jpg",
    				    width: 200
    				},
    				{
    				    width: 200,height:6,
    				    svg: '<svg><line  x1="0"  y1="0"  x2="200"  y2="0"  stroke="#ce2127" stroke-width="6" />'
    				},
    				{
    				    text:"Unterschrift Mieter"
    				}
				]
			]
		},
		" ", 
		"Zusatzversicherung: Ohne Abschluss einer Haftungsreduzierung nach Art einer Vollkasko- oder Teilkaskoversicherung haftet/haften der/die Mieter für Schäden bis zur Höhe des Fahrzeugwertes. Hinweis: Achtung! Unabhängig von der Selbstbeteiligung haftet/Haften der/die Mieter uneingeschränkt für den Ersatz der Wertminderung, Gutachter- und Abschleppkosten ", 
		" ",
		"Zu beachten: Der Mieter ist für Park- und Verkersübertretungen verantwortlich. Dem Mieter ist bekannt, das er verpflichtet ist, bei jedem Unfall der Schaden am Fahrzeug die Polizei hinzuziehen, andernfalls entfallen die Vorteile aus der Haftungsreduzierung (siehe oben) je nach Schwere des Verschuldens bei Verstoß gegen diese Obliegenheit. Die Überlassung des Fahrzeuges an nicht aufgeführte Personen ist dem Mieter untersagt. Auslandsfahrten bedürfen ausdrücklich der schriftlichen Zustimmung des Vermieters. Das Übernameprotokoll ist Bestandteil dieses Mietvertrages.",
		" ",
		"Durch meine Unterschrift bestätige ich als Mieter, dass ich in die derzeit gültige Preisliste bei Abschluss des Mietvertrges Einsicht nehmen konnte. Die Preisliste ist ausdrücklich Bestandteil des Mietvertrages. Des weiteren bestätige ich druch meine Unterschrift, dass ich die umseitigen, diesem Mietvertrag zugrundeliegenden Allgemeinen Geschäftsbedingungen als auch den Mietvertrag selbst sowie die Anlagen/das Übernahmeprotokoll gelesen habe und diese akzeptiere. Entsprechende Durchschläge wurden mir ausgehändigt. "
	]
	
}
