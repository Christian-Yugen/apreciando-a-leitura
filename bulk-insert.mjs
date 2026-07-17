import fs from 'fs';
import mysql from 'mysql2/promise';

const archiveData = JSON.parse(fs.readFileSync('./archive_reviews.json', 'utf-8'));

// Conectar ao banco de dados
const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'apreciando_leitura',
  multipleStatements: true,
});

async function bulkInsert() {
  try {
    console.log(`🌱 Iniciando bulk insert de ${archiveData.length} resenhas...`);
    
    const batchSize = 50;
    let inserted = 0;
    let failed = 0;
    
    for (let i = 0; i < archiveData.length; i += batchSize) {
      const batch = archiveData.slice(i, i + batchSize);
      
      const values = batch.map(review => [
        review.title || 'Sem título',
        review.author || 'Autor Desconhecido',
        review.genre || 'Ficção',
        new Date(review.reviewDate),
        review.excerpt || '',
        review.content || '',
        review.coverImageUrl || null,
        review.purchaseLink || null,
      ]);
      
      try {
        await connection.query(
          'INSERT INTO reviews (title, author, genre, reviewDate, excerpt, content, coverImageUrl, purchaseLink) VALUES ?',
          [values]
        );
        inserted += batch.length;
      } catch (err) {
        failed += batch.length;
        console.error(`  ⚠ Erro no lote ${Math.floor(i / batchSize) + 1}:`, err.message);
      }
      
      if ((i / batchSize + 1) % 10 === 0) {
        console.log(`  ✓ ${inserted} resenhas inseridas (${Math.round((inserted / archiveData.length) * 100)}%)...`);
      }
    }
    
    console.log(`\n✅ Bulk insert concluído!`);
    console.log(`   Inseridas: ${inserted}`);
    console.log(`   Falhadas: ${failed}`);
    
  } catch (err) {
    console.error('❌ Erro fatal:', err);
  } finally {
    await connection.end();
  }
}

bulkInsert();
