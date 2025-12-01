// // Select the database to use.
use('bdBateaux');

// // // // Insert a few documents into the sales collection.
// db.getCollection('skippers').insertMany([
//   { 'sknum': 1, 'sknom': "JEAN", 'skport': "AJACCIO", 'salaire': 3000 },
//   { 'sknum': 2, 'sknom': "PAUL", 'skport': "AJACCIO", 'salaire': 2000 },
//   { 'sknum': 3, 'sknom': "PIERRE", 'skport': "ANTIBES", 'salaire': 1200 },
//   { 'sknum': 4, 'sknom': "MARIE", 'skport': "BASTIA", 'salaire': 1500 },
//   { 'sknum': 5, 'sknom': "BAPTISTE", 'skport': "AJACCIO", 'salaire': 2010 },
// ]);

// db.skippers.updateMany(
//     {'salaire': {$exists: false}},
//     {$set:{'salaire': 1500}}
// )

// db.skippers.aggregate([
//     { $match: {'salaire': {$gt: 0, $exists: true}} },
//     { $group: {
//         _id: '$skport',
//         totalSalaire: { $sum: '$salaire' },
//         avgSalaire: { $avg: '$salaire' },
//         nbSkippers: { $sum: 1 }
//     }},
//     { $project: {
//         totalSalaire: 1,
//         avgSalaire: 1,
//         nbSkippers: 1
//     }}
// ])


// ---------------------
// ---------------------
// ---------------------
// A vous de jouer (5)
// ------------------------
// 1Calculer le salaire moyen des skippers

// db.skippers.aggregate([
//     { $match: { 
//         salaire: { $exists: true,
//         $ne: "aucun" }
//     } },
//     { $group: {
//         _id: null,
//         MoyenneSalaires: { $avg: "$salaire" }
//     }},
//     { $project: {
//         _id: 0,
//         MoyenneSalaires: 1
//     }}
// ])

// 2 Compter le nombre de skippers par port

// db.skippers.aggregate([
//     { $match: { 
//         salaire: { 
//             $exists: true,
//             $ne: "aucun" 
//         } 
//     }},
//     { $group: {
//         _id: "$skport",
//         NombreSkippers: { $sum: 1 }, // "$count: ()" marche aussi.
//     }},
//     { $project: {
//         _id: 0,
//         skport: "$_id",
//         NombreSkippers: 1
//     }}
// ])

// 3 Trouver le skipper avec le salaire le plus élevé et le plus bas dans chaque port

// db.skippers.aggregate([
//   {
//     $match: {
//       salaire: { $ne: null }
//     }
//   },
  
//   {
//     $group: {
//       _id: "$skport",
      
//       max_skipper_info: { 
//         $max: { 
//           salaire: "$salaire", 
//           sknom: "$sknom",     
//         } 
//       },
      
//       min_skipper_info: { 
//         $min: { 
//           salaire: "$salaire",
//           sknom: "$sknom",   
//         } 
//       }
//     }
//   },
  
//   {
//     $project: {
//       _id: 0,
//       Port: "$_id",
      
//       Skipper_Max: "$max_skipper_info.sknom",
//       Salaire_Max: "$max_skipper_info.salaire",
      
//       Skipper_Min: "$min_skipper_info.sknom",
//       Salaire_Min: "$min_skipper_info.salaire",
//     }
//   }
// ])

// 4.0 (Creation de la collection croisieres et insertion des documents)

// db.getCollection('skippers').insertMany([
//   { 'sknum': 1, 'sknom': "JEAN", 'skport': "AJACCIO", 'salaire': 3000 },
//   { 'sknum': 2, 'sknom': "PAUL", 'skport': "AJACCIO", 'salaire': 2000 },
//   { 'sknum': 3, 'sknom': "PIERRE", 'skport': "ANTIBES", 'salaire': 1200 },
//   { 'sknum': 4, 'sknom': "MARIE", 'skport': "BASTIA", 'salaire': 1500 },
//   { 'sknum': 5, 'sknom': "BAPTISTE", 'skport': "AJACCIO", 'salaire': 2010 },
// ]);

// db.getCollection('croisieres').insertMany([
//   { "CROISNUM": "C001", "SKNUM": 1, "BATNUM": "B002", "DEPPORT": "BASTIA", "ARRPORT": "CALVI", "DEPDATE": ISODate("2024-07-10"), "ARRDATE": ISODate("2024-07-11") },
//   { "CROISNUM": "C002", "SKNUM": 2, "BATNUM": "B001", "DEPPORT": "CALVI", "ARRPORT": "AJACCIO", "DEPDATE": ISODate("2024-07-15"), "ARRDATE": ISODate("2024-07-16") },
//   { "CROISNUM": "C003", "SKNUM": 1, "BATNUM": "B003", "DEPPORT": "AJACCIO", "ARRPORT": "BASTIA", "DEPDATE": ISODate("2024-08-21"), "ARRDATE": ISODate("2024-08-22") },
//   { "CROISNUM": "C004", "SKNUM": 3, "BATNUM": "B002", "DEPPORT": "BASTIA", "ARRPORT": "PORTO-VECCHIO", "DEPDATE": ISODate("2024-09-01"), "ARRDATE": ISODate("2024-09-03") },
//   { "CROISNUM": "C005", "SKNUM": 1, "BATNUM": "B002", "DEPPORT": "AJACCIO", "ARRPORT": "CALVI", "DEPDATE": ISODate("2024-10-10"), "ARRDATE": ISODate("2024-10-11") },
//   { "CROISNUM": "C006", "SKNUM": 4, "BATNUM": "B001", "DEPPORT": "PORTO-VECCHIO", "ARRPORT": "AJACCIO", "DEPDATE": ISODate("2024-11-05"), "ARRDATE": ISODate("2024-11-06") }
// ]);

// 4 Donner pour chaque skipper, son nom et le nombre de croisieres au départ de Bastia qu'il effectue

// Version avec unwind et group

// db.skippers.aggregate([
//   {
//     $lookup: {
//       from: "croisieres",
//       localField: "sknum",
//       foreignField: "SKNUM",
//       as: "croisieres_du_skipper"
//     }
//   },
//   {
//     $unwind: "$croisieres_du_skipper"
//   },
//   {
//     $match: {
//       "croisieres_du_skipper.DEPPORT": "BASTIA"
//     }
//   },
//   {
//     $group: {
//       _id: "$sknom",
//       nombreCroisieresBastia: { $sum: 1 }
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       sknom: "$_id",
//       nombreCroisieresBastia: 1
//     }
//   }
// ])

// 5 Donner la liste des ports d’arrivée pour chaque nom de skipper


// essai avec addToSet

// db.skippers.aggregate([
//     {
//         $lookup: {
//           from: "croisieres",
//           localField: "sknum", // sknum de skippers
//           foreignField: "SKNUM", // sknum de croisieres
//           as: "croisieres_du_skipper"
//         },
//     },
//     {
//         $unwind: "$croisieres_du_skipper"
//     },

//     {
//         $group: {
//           _id: "$sknom",
//           tous_les_ports_arrives: { $addToSet: "$croisieres_du_skipper.ARRPORT" }
//         }
//     }
// ])

// avec push (conclusion : addToSet evite les doublons)

// db.skippers.aggregate([
//     {
//         $lookup: {
//           from: "croisieres",
//           localField: "sknum",
//           foreignField: "SKNUM",
//           as: "croisieres_du_skipper"
//         },
//     },
//     {
//         $unwind: "$croisieres_du_skipper"
//     },

//     {
//         $group: {
//           _id: "$sknom",
//           tous_les_ports_arrives: { $push: "$croisieres_du_skipper.ARRPORT" }
//         }
//     }
// ])

// (conclusion : addToSet evite les doublons)

// 6 Calculer le total des jours en mer pour chaque skipper

// db.skippers.aggregate([
//   {
//     $lookup: {
//       from: "croisieres",
//       localField: "sknum",
//       foreignField: "SKNUM",
//       as: "croisieres_du_skipper"
//     }
//   },
//   {
//     $unwind: "$croisieres_du_skipper"
//   },
//   {
//     $group: {
//       _id: "$sknom",
//       totalJoursEnMer: {
//         $sum: {
//           $dateDiff: {
//             startDate: "$croisieres_du_skipper.DEPDATE",
//             endDate: "$croisieres_du_skipper.ARRDATE",
//             unit: "day"
//           }
//         }
//       }
//     }
//   }
// ])


// ---------------------
// ---------------------
// ---------------------
// A vous de jouer (6) : MAP REDUCE
// ------------------------

// // Test exemple 1 ;

// function map() {
//     // On vérifie que le champ ‘salaire' existe
//     if (this.salaire){
//         emit("totalSalaire", this.salaire);
//     }
// }
// // resultat intermediaire (exemple) :
// // { "totalSalaire" : 3000 }
// // { "totalSalaire" : 2000 }
// // { "totalSalaire" : 1200 }
// // { "totalSalaire" : 1500 }
// // { "totalSalaire" : 2010 }

// // qui devient
// // "totalSalaire" : [3000, 2000, 1200, 1500, 2010]

// function reduce(cle, valeurs) {
//     return Array.sum(valeurs);
// // Additionne toutes les valeurs pour obtenir lesalaire total.
// }


// db.skippers.mapReduce(
//     map,
//     reduce,
//     {
//         out: { inline: 1 }, // Les résultats sont retournés directement. On aurait pu les stocker dans une collection aussi.
//         query: { salaire: { $exists: true } } // Filtre pour ne traiter que les documents avec un champ 'salaire'. Optionnel pour optimiser.
//     }
// );

// Test exemple 2 Salaire total par port de résidence

// function map2() {
//   if (this.salaire) {
//     emit(this.skport, this.salaire);
//   }
// }

// function reduce(cle, valeurs) {
//     return Array.sum(valeurs);
// // Additionne toutes les valeurs pour obtenir lesalaire total.
// }

// db.skippers.mapReduce(
//   map2,
//   reduce,
//   {
//     out: "ColSalaires",
//     query: { salaire: { $exists: true }, skport: { $exists: true } } // Filtrage initial optionnel pour optimiser.
//   }
// );

// db.ColSalaires.find()

// 1. Calculer le salaire moyen des skippers

// function map(){
//     if(this.salaire){
//         emit("SalaireMoyen", this.salaire)
//     }
// }

// function reduce(key, value){
//     return Array.sum(value) / value.length
// }

// db.skippers.mapReduce(
//     map,
//     reduce,
//     {
//         out: {inline: 1},
//         query: {
//             salaire: {$exists: true}
//         }
//     }
// )

// 2. Compter le nombre de skippers par port

// function map(){
//     if(this.salaire){
//         emit(this.skport, 1)
//     }
// }

// function reduce(key, value){
//     return Array.sum(value)
// }

// db.skippers.mapReduce(
//     map,
//     reduce,
//     {
//         out: {inline: 1},
//         query: {
//             skport: {$exists: true}
//         }
//     }
// )

// 3. Trouver le skipper avec le salaire le plus élevé et le plus bas dans chaque port

// function map(){
//     if(this.salaire){
//         emit(this.skport, {sknom: this.sknom, salaire: this.salaire})
//     }
// }

// function reduce(key, values){
//     let maxSkipper = values[0];
//     let minSkipper = values[0];
//     for(let i = 1; i < values.length; i++){
//         if(values[i].salaire > maxSkipper.salaire){
//             maxSkipper = values[i];
//         }
//         if(values[i].salaire
//          < minSkipper.salaire){
//             minSkipper = values[i];
//         }
//     }
//     return {maxSkipper: maxSkipper, minSkipper: minSkipper};
// }

// db.skippers.mapReduce(
//     map,
//     reduce,
//     {
//         out: {inline: 1},
//         query: {
//             salaire: {$exists: true}
//         }
//     }
// )