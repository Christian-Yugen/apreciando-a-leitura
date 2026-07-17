import fs from 'fs';
import mysql from 'mysql2/promise';

const archiveData = JSON.parse(fs.readFileSync('./archive_reviews.json', 'utf-8'));

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'apreciando_leitura',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function seedArchive() {
  const connection = await pool.getConnection();
  
  try {
    console.log(`🌱 Iniciando seed com ${archiveData.length} resenhas...`);
    
    // Limpar tabela existente (opcional - comentar se quiser manter dados)
    // await connection.query('DELETE FROM reviews');
    
    let inserted = 0;
    let skipped = 0;
    
    for (const review of archiveData) {
      try {
        const query = `
          INSERT INTO reviews (title, author, genre, reviewDate, excerpt, content, coverImageUrl, purchaseLink)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          title = VALUES(title)
        `;
        
        await connection.query(query, [
          review.title || 'Sem título',
          review.author || 'Autor Desconhecido',
          review.genre || 'Ficção',
          new Date(review.reviewDate),
          review.excerpt || '',
          review.content || '',
          review.coverImageUrl || null,
          review.purchaseLink || null,
        ]);
        
        inserted++;
        
        if (inserted % 100 === 0) {
          console.log(`  ✓ ${inserted} resenhas inseridas...`);
        }
      } catch (err) {
        skipped++;
        if (skipped <= 5) {
          console.error(`  ⚠ Erro ao inserir resenha "${review.title}":`, err.message);
        }
      }
    }
    
    console.log(`\n✅ Seed concluído!`);
    console.log(`   Inseridas: ${inserted}`);
    console.log(`   Puladas: ${skipped}`);
    
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedArchive().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
