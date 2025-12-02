export interface Location {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    status: 'Open' | 'Renovation' | 'Coming Soon';
    mapEmbedUrl?: string;
    city?: string;
    image?: string;
}

export const MOCK_LOCATIONS: Location[] = [
    { 
        id: '1', 
        name: 'Senopati Flagship', 
        address: 'Jl. Senopati No. 10, Jakarta', 
        phone: '+62 21 555 0199', 
        hours: '07:00 - 22:00', 
        status: 'Open',
        city: 'Jakarta',
        image: 'https://picsum.photos/id/42/600/400',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273033621915!2d106.8077583152955!3d-6.227683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15053151515%3A0x7440000000000000!2sJl.%20Senopati%2C%20Kebayoran%20Baru%2C%20Jakarta%20Selatan!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
    },
    { 
        id: '2', 
        name: 'Canggu Beach House', 
        address: 'Jl. Pantai Berawa No. 99, Bali', 
        phone: '+62 361 555 0200', 
        hours: '06:00 - 20:00', 
        status: 'Open',
        city: 'Bali',
        image: 'https://picsum.photos/id/225/600/400',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.095033621915!2d115.1377583152955!3d-8.647683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2488053151515%3A0x7440000000000000!2sJl.%20Pantai%20Berawa%2C%20Bali!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
    },
    { 
        id: '3', 
        name: 'Braga Heritage', 
        address: 'Jl. Braga No. 50, Bandung', 
        phone: '+62 22 555 0300', 
        hours: '08:00 - 23:00', 
        status: 'Renovation',
        city: 'Bandung',
        image: 'https://picsum.photos/id/431/600/400',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.673033621915!2d107.6077583152955!3d-6.917683995491787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e65053151515%3A0x7440000000000000!2sJl.%20Braga%2C%20Bandung!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
    },
];
