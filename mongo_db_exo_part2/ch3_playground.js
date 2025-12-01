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
// A vous de jouer (5)
// ------------------------
// 1

// db.skippers.aggregate([
//     { $match: { salaire: { $exists: true,
//     $ne: "aucun" } } },
//     { $group: {
//     _id: null,
//     MoyenneSalaires: { $avg: "$salaire" }
//     }},
//     { $project: {
//     _id: 0,
//     MoyenneSalaires: 1
//     }}
// ])

// 2

// db.skippers.aggregate([
//     { $match: { 
//         salaire: { 
//             $exists: true,
//             $ne: "aucun" 
//         } 
//     }},
//     { $group: {
//         _id: "$skport",
//         NombreSkippers: { $sum: 1 },
//     }},
//     { $project: {
//         _id: 0,
//         skport: "$_id",
//         NombreSkippers: 1
//     }}
// ])

// 3

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
      
//       // Skipper MAX
//       Skipper_Max: "$max_skipper_info.sknom",
//       Salaire_Max: "$max_skipper_info.salaire",
      
//       // Skipper MIN
//       Skipper_Min: "$min_skipper_info.sknom",
//       Salaire_Min: "$min_skipper_info.salaire",
//     }
//   }
// ])

// 4

// db.getCollection('croisieres').insertMany([
//   { "CROISNUM": "C001", "SKNUM": 1, "BATNUM": "B002", "DEPPORT": "BASTIA", "ARRPORT": "CALVI", "DEPDATE": ISODate("2024-07-10"), "ARRDATE": ISODate("2024-07-11") },
//   { "CROISNUM": "C002", "SKNUM": 2, "BATNUM": "B001", "DEPPORT": "CALVI", "ARRPORT": "AJACCIO", "DEPDATE": ISODate("2024-07-15"), "ARRDATE": ISODate("2024-07-16") },
//   { "CROISNUM": "C003", "SKNUM": 1, "BATNUM": "B003", "DEPPORT": "AJACCIO", "ARRPORT": "BASTIA", "DEPDATE": ISODate("2024-08-21"), "ARRDATE": ISODate("2024-08-22") },
//   { "CROISNUM": "C004", "SKNUM": 3, "BATNUM": "B002", "DEPPORT": "BASTIA", "ARRPORT": "PORTO-VECCHIO", "DEPDATE": ISODate("2024-09-01"), "ARRDATE": ISODate("2024-09-03") },
//   { "CROISNUM": "C005", "SKNUM": 1, "BATNUM": "B002", "DEPPORT": "AJACCIO", "ARRPORT": "CALVI", "DEPDATE": ISODate("2024-10-10"), "ARRDATE": ISODate("2024-10-11") },
//   { "CROISNUM": "C006", "SKNUM": 4, "BATNUM": "B001", "DEPPORT": "PORTO-VECCHIO", "ARRPORT": "AJACCIO", "DEPDATE": ISODate("2024-11-05"), "ARRDATE": ISODate("2024-11-06") }
// ]);

// 4 
// db.skippers.aggregate([
//   {
//     $lookup: {
//       from: "croisieres",
//       localField: "sknum",
//       foreignField: "SKNUM",
//       as: "la_liste_croisieres"
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       sknom: "$sknom",
//       nombreCroisieresBastia: {
//         $size: {
//           $filter: { 
//             input: "$la_liste_croisieres",
//             as: "croisiere",
//             cond: { $eq: ["$$croisiere.DEPPORT", "BASTIA"] }
//           }
//         }
//       }
//     }
//   }
// ])

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

// 5

// essai avec addToSet
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

// 6

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

// 6
