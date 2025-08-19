import React from 'react';

import styles from './StandardPage.module.css'

import { Link } from 'react-router-dom';

function StandardPage({ title, description, mode, children, ...delegated }) {

  return (
    <>
      <CenteredMain
        {...delegated}
      >
          <Section>
            <Header>
              {title}
            </Header>
            { description && <br/>}
            { description }
          </Section>
          {
            title && children && <Divider />
          }
          <Section>
            {children}
          </Section>
      </CenteredMain>
    </>
  )
}

function CenteredMain({ children, className = '', ...delegated }) {
  const centeredMainClassName = `${styles.main} ${className}`
  return (
    <div 
      className={centeredMainClassName}
      {...delegated}
    >
      <div className={styles.content}>
          { children }
      </div>
    </div>
  )
}

function Section({ children, ...delegated }) {
  return (
    <div 
      className={styles.section}
      {...delegated}
    >
      {children}
    </div>
  )
}

function Divider({...delegated}) {
  return (
    <div 
      className={styles.divider}
      {...delegated}
    />
  )
}

function Header({ children, ...delegated }) {
  return (
    <p 
      className={styles.header}
      {...delegated}
    >
      { children }
    </p>
  )
}

export default StandardPage;
