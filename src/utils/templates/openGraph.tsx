import React from 'react'
import { DocumentOGData, OGImageParams } from '../../@types/og.ts'
import { Ghostify } from '../../components/shared/Icons.tsx'

interface TemplateProps {
  params: OGImageParams
  data?: DocumentOGData
}

export const PageTemplate: React.FC<TemplateProps> = ({ params }) => (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      backgroundImage:
        'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
      backgroundSize: '100px 100px',
      color: 'white',
      padding: '40px'
    }}
  >
    {/* Header with logo */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px'
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '20px'
        }}
      >
        <span>
          <Ghostify style={{ width: '35px', height: '45px' }} />
        </span>
      </div>
      <span
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        Ghostify
      </span>
    </div>

    {/* Main title */}
    <h1
      style={{
        fontSize: '72px',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 1.1,
        margin: '0 0 20px 0',
        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
        backgroundClip: 'text',
        color: 'transparent'
      }}
    >
      {params.title}
    </h1>

    {/* Description */}
    {params.description && (
      <p
        style={{
          fontSize: '24px',
          textAlign: 'center',
          color: '#888',
          margin: '0',
          maxWidth: '600px'
        }}
      >
        {params.description}
      </p>
    )}
  </div>
)

export const DocumentTemplate: React.FC<TemplateProps> = ({ params, data }) => (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      backgroundColor: '#0a0a0a',
      color: 'white'
    }}
  >
    {/* Partie gauche - Informations */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      {/* Logo en haut */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '40px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}
        >
          <span>
            <Ghostify style={{ width: '25px', height: '35px' }} />
          </span>
        </div>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Ghostify</span>
      </div>

      {/* Type de document */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <span
          style={{
            backgroundColor: '#ff6b35',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}
        >
          {data?.type || 'Document'}
        </span>
      </div>

      {/* Titre du document */}
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          lineHeight: 1.2,
          margin: '0 0 16px 0',
          color: 'white'
        }}
      >
        {params.title}
      </h1>

      {/* Auteur */}
      {data?.author && (
        <p
          style={{
            fontSize: '20px',
            color: '#aaa',
            margin: '0 0 24px 0'
          }}
        >
          Par {data.author}
        </p>
      )}

      {/* Template utilisé */}
      {data?.template && (
        <p
          style={{
            fontSize: '16px',
            color: '#888',
            margin: '0'
          }}
        >
          Template: {data.template}
        </p>
      )}
    </div>

    {/* Partie droite - Aperçu du document */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative'
      }}
    >
      {/* Mockup de document */}
      <div
        style={{
          width: '280px',
          height: '360px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          transform: 'rotate(-2deg)'
        }}
      >
        {/* Header du document */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              width: '60%',
              height: '8px',
              backgroundColor: '#ff6b35',
              borderRadius: '4px',
              marginBottom: '6px'
            }}
          />
          <div
            style={{
              width: '40%',
              height: '6px',
              backgroundColor: '#ddd',
              borderRadius: '3px'
            }}
          />
        </div>

        {/* Contenu simulé */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              width: `${Math.random() * 40 + 50}%`,
              height: '4px',
              backgroundColor: '#eee',
              borderRadius: '2px',
              marginBottom: '6px'
            }}
          />
        ))}
      </div>
    </div>
  </div>
)

export const ResumeTemplate: React.FC<TemplateProps> = ({ params, data }) => (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}
  >
    {/* Background pattern */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage:
          'radial-gradient(circle at 2px 2px, rgba(255,107,53,0.1) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}
    />

    {/* Contenu principal */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        zIndex: 1
      }}
    >
      {/* Badge CV */}
      <div
        style={{
          backgroundColor: '#ff6b35',
          color: 'white',
          padding: '8px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Curriculum Vitae
      </div>

      {/* Nom */}
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 1.1,
          margin: '0 0 16px 0',
          color: '#1a1a1a'
        }}
      >
        {data?.author || params.title}
      </h1>

      {/* Titre du poste */}
      <p
        style={{
          fontSize: '24px',
          textAlign: 'center',
          color: '#666',
          margin: '0 0 40px 0'
        }}
      >
        {params.description || 'Professionnel expérimenté'}
      </p>

      {/* Footer avec logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}
        >
          <span>
            <Ghostify style={{ width: '15px', height: '25px' }} />
          </span>
        </div>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1a1a1a'
          }}
        >
          Made by Ghostify.
        </span>
      </div>
    </div>
  </div>
)
