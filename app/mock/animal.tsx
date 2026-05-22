

// export class AnimalMock {
//     private static animalDB: Animal[] = [
//         new Animal(1, "Bolinha", "Cachorro", "Vira-lata", "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400", true),
//         new Animal(2, "Luna", "Gato", "Siamês", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", true),
//     ];

//     static async listarTodos(): Promise<Animal[]> {
//         return [...this.animalDB];
//     }

//     static async salvar(animal: Animal): Promise<void> {
//         const indexExistente = this.animalDB.findIndex(a => a.id === animal.id);

//         if (indexExistente === -1) {
//             const novoId = this.animalDB.length > 0 
//                 ? Math.max(...this.animalDB.map(a => a.id)) + 1 
//                 : 1;
//             animal.id = novoId;
//             this.animalDB.push(animal);
//             console.log(`Animal Id ${novoId} salvo com sucesso`);
//         } else {
//             this.animalDB[indexExistente] = animal;
//             console.log(`Animal Id ${animal.id} atualizado com sucesso!`);
//         }
//     }

//     static async buscarPorId(id: number): Promise<Animal | undefined> {
//         return this.animalDB.find(a => a.id === id);
//     }
// }