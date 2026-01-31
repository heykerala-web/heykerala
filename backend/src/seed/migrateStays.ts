import Stay from '../models/Stay';

export const migrateStays = async () => {
    try {
        console.log('🔄 Starting data migration for Stays...');

        // Find stays that have pricePerNight but no price
        // @ts-ignore
        const staysToFix = await Stay.find({ price: { $exists: false }, pricePerNight: { $exists: true } });

        if (staysToFix.length === 0) {
            console.log('✅ No stays need migration.');
            return;
        }

        console.log(`⚠️ Found ${staysToFix.length} stays to migrate.`);

        for (const stay of staysToFix) {
            // @ts-ignore
            stay.price = stay.pricePerNight || stay.averagePrice || 0;
            stay.status = 'approved'; // Approve existing stays
            await stay.save();
        }

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
};
