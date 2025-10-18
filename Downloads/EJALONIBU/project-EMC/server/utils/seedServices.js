const Service = require('../models/Service');

const seedServices = async () => {
  try {
    // Check if services already exist
    const existingServices = await Service.count();
    if (existingServices > 0) {
      console.log('Services already seeded');
      return;
    }

    const services = [
      {
        name: 'Basic Metal Framework',
        category: 'metal-construction',
        description: 'Standard structural metalwork for small to medium buildings and frameworks with professional welding and finishing.',
        shortDescription: 'Professional structural metalwork for buildings and frameworks',
        features: [
          'Structural Steel Work',
          'Professional Welding',
          'Standard Finishing',
          'Quality Inspection',
          'Material Certification'
        ],
        specifications: {
          steelGrade: 'S275',
          welding: 'AWS D1.1',
          coating: 'Primer + Paint',
          loadCapacity: 'Up to 50 tons'
        },
        priceRange: {
          min: 2500,
          max: 8000,
          currency: 'USD'
        },
        duration: '2-4 weeks',
        complexity: 'basic',
        image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 1,
        seoTitle: 'Basic Metal Framework Construction Services',
        seoDescription: 'Professional basic metal framework construction with quality materials and expert craftsmanship.',
        tags: ['metal construction', 'structural work', 'welding', 'framework']
      },
      {
        name: 'Industrial Metal Construction',
        category: 'metal-construction',
        description: 'Heavy-duty industrial metalwork for factories, warehouses, and large structures with advanced engineering.',
        shortDescription: 'Heavy-duty industrial metalwork for large structures',
        features: [
          'Heavy Structural Work',
          'Precision Engineering',
          'Industrial Grade Materials',
          'Comprehensive Testing',
          'Project Management'
        ],
        specifications: {
          steelGrade: 'S355',
          welding: 'AWS D1.1 & D1.2',
          coating: 'Hot-dip Galvanizing',
          loadCapacity: '100+ tons'
        },
        priceRange: {
          min: 15000,
          max: 50000,
          currency: 'USD'
        },
        duration: '6-12 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 2,
        seoTitle: 'Industrial Metal Construction Services',
        seoDescription: 'Heavy-duty industrial metal construction for factories and warehouses.',
        tags: ['industrial construction', 'heavy duty', 'factory', 'warehouse']
      },
      {
        name: 'Decorative Wrought Iron',
        category: 'wrought-iron',
        description: 'Elegant decorative wrought iron gates, railings, and artistic elements with custom designs.',
        shortDescription: 'Elegant decorative wrought iron work with custom designs',
        features: [
          'Custom Designs',
          'Hand-forged Elements',
          'Artistic Finishing',
          'Rust Protection',
          'Installation Service'
        ],
        specifications: {
          material: 'Mild Steel',
          thickness: '12-20mm',
          finish: 'Powder Coating',
          design: 'Custom Patterns'
        },
        priceRange: {
          min: 800,
          max: 3500,
          currency: 'USD'
        },
        duration: '1-3 weeks',
        complexity: 'intermediate',
        image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 3,
        seoTitle: 'Decorative Wrought Iron Work Services',
        seoDescription: 'Custom decorative wrought iron gates, railings, and artistic elements.',
        tags: ['wrought iron', 'decorative', 'gates', 'railings', 'artistic']
      },
      {
        name: 'Security Wrought Iron',
        category: 'wrought-iron',
        description: 'Heavy-duty security gates and barriers with decorative elements and advanced security features.',
        shortDescription: 'Heavy-duty security gates with decorative elements',
        features: [
          'Security Features',
          'Reinforced Structure',
          'Advanced Locking',
          'Anti-climb Design',
          'Access Control Ready'
        ],
        specifications: {
          material: 'High-tensile Steel',
          thickness: '16-25mm',
          securityRating: 'Class 3',
          lockSystem: 'Multi-point'
        },
        priceRange: {
          min: 1200,
          max: 5000,
          currency: 'USD'
        },
        duration: '2-4 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 4,
        seoTitle: 'Security Wrought Iron Gates and Barriers',
        seoDescription: 'Heavy-duty security wrought iron gates with advanced security features.',
        tags: ['security gates', 'wrought iron', 'barriers', 'access control']
      },
      {
        name: 'Aluminum Windows & Doors',
        category: 'aluminum-works',
        description: 'Modern aluminum window and door installations for residential and commercial use with energy efficiency.',
        shortDescription: 'Modern aluminum windows and doors with energy efficiency',
        features: [
          'Energy Efficient',
          'Weather Sealing',
          'Modern Hardware',
          'Custom Sizing',
          'Professional Installation'
        ],
        specifications: {
          profile: '6063-T5',
          glass: 'Double Glazed',
          hardware: 'European Standard',
          thermalBreak: 'Yes'
        },
        priceRange: {
          min: 300,
          max: 1500,
          currency: 'USD'
        },
        duration: '1-2 weeks',
        complexity: 'basic',
        image: 'https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 5,
        seoTitle: 'Aluminum Windows and Doors Installation',
        seoDescription: 'Energy-efficient aluminum windows and doors for residential and commercial use.',
        tags: ['aluminum windows', 'doors', 'energy efficient', 'modern']
      },
      {
        name: 'Curtain Wall Systems',
        category: 'aluminum-works',
        description: 'Advanced curtain wall systems for commercial buildings and high-rises with structural glazing.',
        shortDescription: 'Advanced curtain wall systems for commercial buildings',
        features: [
          'Structural Glazing',
          'Weather Performance',
          'Thermal Efficiency',
          'Seismic Resistance',
          'Design Flexibility'
        ],
        specifications: {
          system: 'Stick/Unitized',
          glass: 'High Performance',
          sealant: 'Structural',
          windLoad: '2.5 kPa'
        },
        priceRange: {
          min: 8000,
          max: 25000,
          currency: 'USD'
        },
        duration: '4-8 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 6,
        seoTitle: 'Commercial Curtain Wall Systems',
        seoDescription: 'Advanced curtain wall systems for commercial buildings and high-rises.',
        tags: ['curtain wall', 'commercial', 'glazing', 'high-rise']
      },
      {
        name: 'Residential Security Fencing',
        category: 'security-fence',
        description: 'Chain link and security wire fencing for residential properties with professional installation.',
        shortDescription: 'Chain link and security fencing for residential properties',
        features: [
          'Chain Link Mesh',
          'Galvanized Posts',
          'Security Wire Top',
          'Gate Installation',
          'Professional Setup'
        ],
        specifications: {
          height: '1.8-2.4m',
          mesh: '50x50mm',
          wire: '3.15mm',
          posts: '60x60mm'
        },
        priceRange: {
          min: 15,
          max: 35,
          currency: 'USD'
        },
        duration: '3-7 days',
        complexity: 'basic',
        image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 7,
        seoTitle: 'Residential Security Fencing Installation',
        seoDescription: 'Professional residential security fencing with chain link and security wire.',
        tags: ['security fence', 'residential', 'chain link', 'perimeter']
      },
      {
        name: 'Commercial Security Perimeter',
        category: 'security-fence',
        description: 'High-security perimeter fencing for commercial and industrial facilities with detection systems.',
        shortDescription: 'High-security perimeter fencing for commercial facilities',
        features: [
          'Anti-climb Mesh',
          'Razor Wire',
          'Detection Systems',
          'Access Control',
          'Monitoring Integration'
        ],
        specifications: {
          height: '2.4-4.0m',
          securityRating: 'SR1-SR2',
          detection: 'Optional',
          access: 'Automated Gates'
        },
        priceRange: {
          min: 25,
          max: 60,
          currency: 'USD'
        },
        duration: '1-2 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 8,
        seoTitle: 'Commercial Security Perimeter Fencing',
        seoDescription: 'High-security perimeter fencing for commercial and industrial facilities.',
        tags: ['commercial security', 'perimeter', 'anti-climb', 'detection']
      },
      {
        name: 'Residential Heavy Duty Gates',
        category: 'heavy-duty-gates',
        description: 'Quality heavy-duty gates for residential properties with security features and automation.',
        shortDescription: 'Heavy-duty residential gates with security and automation',
        features: [
          'Automated Opening',
          'Security Locks',
          'Weather Resistant',
          'Remote Control',
          'Safety Features'
        ],
        specifications: {
          material: 'Steel Frame',
          motor: '24V DC',
          weightCapacity: '400kg',
          openingSpeed: '12m/min'
        },
        priceRange: {
          min: 800,
          max: 2500,
          currency: 'USD'
        },
        duration: '1-2 weeks',
        complexity: 'intermediate',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 9,
        seoTitle: 'Residential Heavy Duty Gates Installation',
        seoDescription: 'Automated heavy-duty gates for residential properties with security features.',
        tags: ['heavy duty gates', 'residential', 'automated', 'security']
      },
      {
        name: 'Industrial Heavy Duty Gates',
        category: 'heavy-duty-gates',
        description: 'Industrial-grade gates and doors for factories and commercial facilities with advanced safety systems.',
        shortDescription: 'Industrial-grade gates with advanced safety systems',
        features: [
          'Heavy Duty Motors',
          'Safety Systems',
          'Access Control',
          'Emergency Override',
          'Load Monitoring'
        ],
        specifications: {
          material: 'Reinforced Steel',
          motor: '3-phase',
          weightCapacity: '2000kg',
          safety: 'Photocells & Loops'
        },
        priceRange: {
          min: 3000,
          max: 12000,
          currency: 'USD'
        },
        duration: '2-4 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 10,
        seoTitle: 'Industrial Heavy Duty Gates and Doors',
        seoDescription: 'Industrial-grade gates and doors with advanced safety and access control.',
        tags: ['industrial gates', 'heavy duty', 'safety systems', 'commercial']
      },
      {
        name: 'Basic Car Park Structure',
        category: 'car-park-installation',
        description: 'Simple covered car park structures for residential and small commercial use with steel framework.',
        shortDescription: 'Covered car park structures for residential use',
        features: [
          'Steel Frame Structure',
          'Roofing System',
          'Concrete Foundation',
          'Basic Drainage',
          'Weather Protection'
        ],
        specifications: {
          capacity: '2-10 cars',
          height: '2.5m clearance',
          roofing: 'Metal Sheets',
          foundation: 'Concrete Pads'
        },
        priceRange: {
          min: 1500,
          max: 5000,
          currency: 'USD'
        },
        duration: '1-3 weeks',
        complexity: 'basic',
        image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 11,
        seoTitle: 'Basic Car Park Structure Installation',
        seoDescription: 'Simple covered car park structures for residential and small commercial use.',
        tags: ['car park', 'covered parking', 'steel structure', 'residential']
      },
      {
        name: 'Multi-Level Car Park',
        category: 'car-park-installation',
        description: 'Advanced multi-level car park systems for commercial and institutional use with comprehensive infrastructure.',
        shortDescription: 'Advanced multi-level car park systems for commercial use',
        features: [
          'Multi-Level Design',
          'Ramp Systems',
          'Lighting & Ventilation',
          'Fire Safety Systems',
          'Traffic Management'
        ],
        specifications: {
          capacity: '50-500 cars',
          levels: '2-6 floors',
          rampGrade: '1:7',
          load: '2.5 kN/m²'
        },
        priceRange: {
          min: 25000,
          max: 100000,
          currency: 'USD'
        },
        duration: '8-16 weeks',
        complexity: 'advanced',
        image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        displayOrder: 12,
        seoTitle: 'Multi-Level Car Park Construction',
        seoDescription: 'Advanced multi-level car park systems for commercial and institutional use.',
        tags: ['multi-level parking', 'commercial', 'car park', 'infrastructure']
      }
    ];

    await Service.bulkCreate(services);
    console.log('Services seeded successfully');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

module.exports = seedServices;